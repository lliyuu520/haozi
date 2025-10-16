package cn.lliyuu520.haozi.common.utils;

import cn.hutool.core.collection.CollUtil;
import cn.hutool.http.HttpRequest;
import com.alibaba.excel.enums.CellDataTypeEnum;
import com.alibaba.excel.metadata.data.ImageData;
import com.alibaba.excel.metadata.data.WriteCellData;
import cn.lliyuu520.haozi.common.config.ImageCompressionConfig;
import cn.lliyuu520.haozi.common.dto.FileDTO;
import lombok.experimental.UtilityClass;
import lombok.extern.slf4j.Slf4j;

import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;
import javax.imageio.stream.ImageOutputStream;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

/**
 * Excel 图片处理工具 - 支持压缩和并行下载
 *
 * @author liliangyu
 */
@Slf4j
@UtilityClass
public class ExcelImageUtil {


    // 线程池用于并行下载
    private static final ExecutorService DOWNLOAD_EXECUTOR =
            Executors.newFixedThreadPool(10);
    // 默认配置（如果Spring配置不可用）
    private static final ImageCompressionConfig DEFAULT_CONFIG = new ImageCompressionConfig();

    /**
     * 设置图片列表并自动压缩图片
     * 支持并行下载和智能压缩
     *
     * @param imageList 图片列表
     * @param config    压缩配置（可选，为null时使用默认配置）
     */
    public WriteCellData<Void> buildWriteCellData(List<FileDTO> imageList, ImageCompressionConfig config) {
        WriteCellData<Void> writeCellData = new WriteCellData<>();

        if (CollUtil.isEmpty(imageList)) {
            writeCellData.setStringValue("暂无图片");
            writeCellData.setType(CellDataTypeEnum.STRING);
            return writeCellData;
        }

        final int size = imageList.size();

        // 如果图片数量超过阈值，只显示链接
        if (size > ImageLayoutConfig.MAX_IMAGES_BEFORE_LINK) {
            String joinedUrls = imageList.stream()
                    .map(FileDTO::getUrl)
                    .reduce((a, b) -> a + "\n" + b)
                    .orElse("暂无图片");

            writeCellData.setStringValue(joinedUrls);
            writeCellData.setType(CellDataTypeEnum.STRING);
            return writeCellData;
        }

        // 使用默认配置如果未提供
        if (config == null) {
            config = DEFAULT_CONFIG;
        }

        // 并行下载和压缩图片
        List<ImageData> imageDataList = downloadAndCompressImagesParallel(imageList, config);

        if (imageDataList.isEmpty()) {
            writeCellData.setStringValue("图片加载失败");
            writeCellData.setType(CellDataTypeEnum.STRING);
            return writeCellData;
        }

        writeCellData.setType(CellDataTypeEnum.EMPTY);
        writeCellData.setImageDataList(imageDataList);
        return writeCellData;
    }

    /**
     * 重载方法，使用默认配置
     */
    public WriteCellData<Void> buildWriteCellData(List<FileDTO> imageList) {
        return buildWriteCellData(imageList, null);
    }

    /**
     * 并行下载和压缩图片
     */
    private List<ImageData> downloadAndCompressImagesParallel(List<FileDTO> imageList, ImageCompressionConfig config) {
        List<CompletableFuture<ImageData>> futures = new ArrayList<>();

        // 创建异步任务
        for (int i = 0; i < imageList.size(); i++) {
            final int index = i;
            final FileDTO fileDTO = imageList.get(i);

            CompletableFuture<ImageData> future = CompletableFuture
                    .supplyAsync(() -> downloadAndCompressImage(fileDTO.getUrl(), index, imageList.size(), config), DOWNLOAD_EXECUTOR)
                    .exceptionally(throwable -> {
                        log.warn("处理图片失败: {}", fileDTO.getUrl(), throwable);
                        return null;
                    });

            futures.add(future);
        }

        // 等待所有任务完成并收集结果
        return futures.stream()
                .map(CompletableFuture::join)
                .filter(Objects::nonNull)
                .toList();
    }

    /**
     * 下载并压缩单个图片
     */
    private ImageData downloadAndCompressImage(String url, int index, int totalImages, ImageCompressionConfig config) {
        byte[] compressedBytes = downloadImageWithRetry(url, config);
        if (compressedBytes == null) {
            return null;
        }

        // 压缩图片并获取实际尺寸
        ImageCompressionResult compressionResult = compressImageBytesWithSize(compressedBytes, config);
        if (compressionResult == null || compressionResult.imageBytes == null) {
            return null;
        }

        // 创建ImageData并设置位置
        ImageData imageData = new ImageData();
        imageData.setImage(compressionResult.imageBytes);
        imageData.setImageType(ImageData.ImageType.PICTURE_TYPE_JPEG); // 统一使用JPEG格式

        // 计算图片位置（使用实际图片尺寸）
        calculateImagePosition(imageData, index, totalImages, compressionResult.actualWidth, compressionResult.actualHeight);

        return imageData;
    }

    /**
     * 带重试的图片下载
     */
    private byte[] downloadImageWithRetry(String url, ImageCompressionConfig config) {
        Exception lastException = null;

        for (int attempt = 0; attempt <= config.getMaxRetries(); attempt++) {
            try {
                log.debug("下载图片 (尝试 {}/{}): {}", attempt + 1, config.getMaxRetries() + 1, url);

                return HttpRequest.get(url)
                        .timeout(config.getTimeoutMs())
                        .execute()
                        .bodyBytes();

            } catch (Exception e) {
                lastException = e;
                log.warn("下载图片失败 (尝试 {}/{}): {}", attempt + 1, config.getMaxRetries() + 1, url);

                // 如果不是最后一次尝试，等待一小段时间再重试
                if (attempt < config.getMaxRetries()) {
                    try {
                        Thread.sleep(500 * (attempt + 1)); // 递增等待时间
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        break;
                    }
                }
            }
        }

        log.error("下载图片最终失败: {}", url, lastException);
        return null;
    }

    /**
     * 图片压缩结果类
     */
    private static class ImageCompressionResult {
        byte[] imageBytes;
        int actualWidth;
        int actualHeight;

        ImageCompressionResult(byte[] imageBytes, int actualWidth, int actualHeight) {
            this.imageBytes = imageBytes;
            this.actualWidth = actualWidth;
            this.actualHeight = actualHeight;
        }
    }

    /**
     * 压缩图片字节数组（带尺寸信息）
     */
    private ImageCompressionResult compressImageBytesWithSize(byte[] originalBytes, ImageCompressionConfig config) {
        try {
            // 读取原图
            BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(originalBytes));
            if (originalImage == null) {
                log.warn("无法解析图片格式");
                return null;
            }

            // 计算压缩后的尺寸
            int[] newSize = calculateCompressedSize(
                    originalImage.getWidth(),
                    originalImage.getHeight(),
                    config.getMaxWidth(),
                    config.getMaxHeight()
            );

            // 如果尺寸没有变化且原图已经很小，直接返回
            if (newSize[0] == originalImage.getWidth() &&
                newSize[1] == originalImage.getHeight() &&
                originalBytes.length <= config.getMaxFileSizeKb() * 1024) {
                return new ImageCompressionResult(originalBytes, originalImage.getWidth(), originalImage.getHeight());
            }

            // 创建压缩后的图片
            BufferedImage compressedImage = resizeImage(originalImage, newSize[0], newSize[1]);

            // 压缩为JPEG格式
            byte[] compressedBytes = compressToJpeg(compressedImage, config.getJpegQuality());

            // 如果压缩后仍然太大，进一步降低质量
            if (compressedBytes.length > config.getMaxFileSizeKb() * 1024) {
                compressedBytes = compressToTargetSize(compressedImage, config.getMaxFileSizeKb() * 1024);
            }

            log.debug("图片压缩完成: {}KB -> {}KB, 尺寸: {}x{} -> {}x{}",
                    originalBytes.length / 1024,
                    compressedBytes.length / 1024,
                    originalImage.getWidth(),
                    originalImage.getHeight(),
                    newSize[0],
                    newSize[1]);

            return new ImageCompressionResult(compressedBytes, newSize[0], newSize[1]);

        } catch (Exception e) {
            log.error("图片压缩失败", e);
            // 压缩失败返回原图尺寸
            try {
                BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(originalBytes));
                if (originalImage != null) {
                    return new ImageCompressionResult(originalBytes, originalImage.getWidth(), originalImage.getHeight());
                }
            } catch (Exception ex) {
                log.error("读取原图尺寸失败", ex);
            }
            return null;
        }
    }

    /**
     * 压缩图片字节数组（兼容方法）
     */
    private byte[] compressImageBytes(byte[] originalBytes, ImageCompressionConfig config) {
        ImageCompressionResult result = compressImageBytesWithSize(originalBytes, config);
        return result != null ? result.imageBytes : originalBytes;
    }

    /**
     * 计算压缩后的尺寸（固定宽度，等比例缩放高度）
     */
    private int[] calculateCompressedSize(int originalWidth, int originalHeight, int maxWidth, int maxHeight) {
        // 如果原图宽度已经小于等于目标宽度，且高度也合适，保持原样
        if (originalWidth <= maxWidth && originalHeight <= maxHeight) {
            return new int[]{originalWidth, originalHeight};
        }

        // 固定宽度，等比例计算高度
        double ratio = (double) maxWidth / originalWidth;
        int newWidth = maxWidth;
        int newHeight = (int) (originalHeight * ratio);

        // 如果计算出的高度超过最大高度限制，则按高度重新计算
        if (newHeight > maxHeight) {
            ratio = (double) maxHeight / originalHeight;
            newHeight = maxHeight;
            newWidth = (int) (originalWidth * ratio);
        }

        return new int[]{newWidth, newHeight};
    }

    /**
     * 调整图片尺寸
     */
    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        BufferedImage resizedImage = new BufferedImage(targetWidth, targetHeight, BufferedImage.TYPE_INT_RGB);
        Graphics2D g2d = resizedImage.createGraphics();

        // 设置高质量渲染
        g2d.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
        g2d.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
        g2d.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

        g2d.drawImage(originalImage, 0, 0, targetWidth, targetHeight, null);
        g2d.dispose();

        return resizedImage;
    }

    /**
     * 压缩为JPEG格式
     */
    private byte[] compressToJpeg(BufferedImage image, float quality) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();

        Iterator<ImageWriter> writers = ImageIO.getImageWritersByFormatName("jpeg");
        if (!writers.hasNext()) {
            throw new IOException("没有找到JPEG编码器");
        }

        ImageWriter writer = writers.next();
        ImageWriteParam param = writer.getDefaultWriteParam();
        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(quality);

        try (ImageOutputStream ios = ImageIO.createImageOutputStream(baos)) {
            writer.setOutput(ios);
            writer.write(null, new javax.imageio.IIOImage(image, null, null), param);
        } finally {
            writer.dispose();
        }

        return baos.toByteArray();
    }

    /**
     * 压缩到目标文件大小
     */
    private byte[] compressToTargetSize(BufferedImage image, int targetSizeBytes) {
        float quality = 0.9f;
        byte[] result = null;

        // 逐步降低质量直到达到目标大小
        while (quality > 0.1f) {
            try {
                byte[] compressed = compressToJpeg(image, quality);
                if (compressed.length <= targetSizeBytes) {
                    result = compressed;
                    break;
                }
                quality -= 0.1f;
            } catch (IOException e) {
                log.warn("压缩失败，质量参数: {}", quality, e);
                break;
            }
        }

        // 如果还是太大，最后尝试进一步缩小尺寸
        if (result == null || result.length > targetSizeBytes) {
            try {
                int newWidth = (int) (image.getWidth() * 0.8);
                int newHeight = (int) (image.getHeight() * 0.8);
                BufferedImage smallerImage = resizeImage(image, newWidth, newHeight);
                result = compressToJpeg(smallerImage, 0.7f);
            } catch (IOException e) {
                log.warn("最终压缩失败", e);
            }
        }

        return result;
    }

    /**
     * 计算图片位置，避免堆叠（支持动态尺寸）
     */
    private void calculateImagePosition(ImageData imageData, int index, int totalImages, int actualImageWidth, int actualImageHeight) {
        final int spacing = ImageLayoutConfig.SPACING;

        // 获取最大允许尺寸
        int[] maxSize = calculateOptimalImageSize(totalImages);
        int maxImageWidth = maxSize[0];
        int maxImageHeight = maxSize[1];

        // 计算位置（使用最大尺寸来计算布局位置，但使用实际图片尺寸）
        int[] position = calculateImagePosition(index, totalImages, maxImageWidth, maxImageHeight, actualImageWidth, actualImageHeight, spacing);
        int top = position[0];
        int left = position[1];
        int bottom = top + actualImageHeight;
        int right = left + actualImageWidth;

        // 设置图片位置
        imageData.setTop(top);
        imageData.setLeft(left);
        imageData.setBottom(bottom);
        imageData.setRight(right);
        imageData.setRelativeLastColumnIndex(1);
    }

    /**
     * 计算最优图片尺寸（等比例缩放）
     */
    private int[] calculateOptimalImageSize(int totalImages) {
        // 获取目标最大尺寸配置
        int configIndex;
        if (totalImages == 1) {
            configIndex = 0;
        } else if (totalImages <= 3) {
            configIndex = 1;
        } else if (totalImages <= 6) {
            configIndex = 2;
        } else {
            configIndex = 3;
        }

        int[] maxSize = ImageLayoutConfig.IMAGE_MAX_SIZES[configIndex];
        return maxSize.clone();
    }

    /**
     * 计算图片位置坐标（固定宽度，垂直居中）
     */
    private int[] calculateImagePosition(int index, int totalImages, int maxImageWidth, int maxImageHeight, int actualImageWidth, int actualImageHeight, int spacing) {
        int columns = getGridColumns(totalImages);
        int rows = (totalImages + columns - 1) / columns; // 向上取整

        int row = index / columns;
        int col = index % columns;

        // 使用最大尺寸计算网格布局
        int totalGridWidth = columns * maxImageWidth + (columns - 1) * spacing;
        int totalGridHeight = rows * maxImageHeight + (rows - 1) * spacing;

        // 计算单元格大小（假设Excel单元格大小约为100x20像素）
        int cellWidth = 100;
        int cellHeight = 20;

        // 计算居中偏移
        int centerOffsetX = Math.max(0, (cellWidth - totalGridWidth) / 2);
        int centerOffsetY = Math.max(0, (cellHeight - totalGridHeight) / 2);

        // 计算基于最大尺寸的网格位置
        int gridTop = centerOffsetY + spacing + (row * (maxImageHeight + spacing));
        int gridLeft = centerOffsetX + spacing + (col * (maxImageWidth + spacing));

        // 固定宽度，不需要水平居中偏移；垂直方向居中实际图片
        int top = gridTop + (maxImageHeight - actualImageHeight) / 2;
        int left = gridLeft; // 固定宽度，左边对齐

        return new int[]{top, left};
    }

    /**
     * 根据图片数量获取网格列数配置
     */
    private int getGridColumns(int totalImages) {
        if (totalImages == 1) {
            return ImageLayoutConfig.GRID_COLUMNS[0];
        } else if (totalImages <= 3) {
            return ImageLayoutConfig.GRID_COLUMNS[1];
        } else if (totalImages <= 6) {
            return ImageLayoutConfig.GRID_COLUMNS[2];
        } else {
            return ImageLayoutConfig.GRID_COLUMNS[3];
        }
    }



    /**
     * 关闭线程池（在应用关闭时调用）
     */
    public static void shutdown() {
        DOWNLOAD_EXECUTOR.shutdown();
    }

    /**
     * Excel图片布局配置类
     */
    private static class ImageLayoutConfig {
        // 图片间距
        private static final int SPACING = 2;

        // 图片尺寸配置 [固定宽度, 最大高度] - 固定宽度等比例缩放
        private static final int[][] IMAGE_MAX_SIZES = {
                {80, 40},  // 1张图片 - 固定宽度80，最大高度40
                {60, 30},  // 2-3张图片 - 固定宽度60，最大高度30
                {40, 20},  // 4-6张图片 - 固定宽度40，最大高度20
                {30, 15}   // 7张及以上 - 固定宽度30，最大高度15
        };

        // 网格布局配置
        private static final int[] GRID_COLUMNS = {1, 1, 3, 3};

        // 显示链接的阈值
        private static final int MAX_IMAGES_BEFORE_LINK = 5;
    }
}