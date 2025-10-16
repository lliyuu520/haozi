package cn.lliyuu520.haozi.modules.sys.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.toolkit.Wrappers;
import cn.lliyuu520.haozi.common.base.page.PageVO;
import cn.lliyuu520.haozi.common.base.service.impl.BaseServiceImpl;
import cn.lliyuu520.haozi.modules.sys.entity.SysLog;
import cn.lliyuu520.haozi.modules.sys.mapper.SysLogMapper;
import cn.lliyuu520.haozi.modules.sys.query.SysLogQuery;
import cn.lliyuu520.haozi.modules.sys.service.SysLogService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

/**
 * 系统日志服务实现类
 *
 * @author lliyuu520 lliyuu520@gmail.com
 */
@Service
public class SysLogServiceImpl extends BaseServiceImpl<SysLogMapper, SysLog> implements SysLogService {


   

    /**
     * 分页查询
     *
     * @param sysLogQuery 日志查询条件
     * @return 日志列表
     */
    @Override
    public PageVO<SysLog> pageVO(SysLogQuery sysLogQuery) {

        final IPage<SysLog> page = page(getPage(sysLogQuery), buildQueryWrapper(sysLogQuery));
        return PageVO.of(page);
    }

    /**
     * 构建查询条件
     * @param sysLogQuery
     * @return
     */
   private  LambdaQueryWrapper<SysLog> buildQueryWrapper(SysLogQuery sysLogQuery){
       final LambdaQueryWrapper<SysLog> queryWrapper = Wrappers.lambdaQuery();

       final String moduleName = sysLogQuery.getModuleName();
       if(StrUtil.isNotBlank(moduleName)){
           queryWrapper.eq(SysLog::getModuleName,moduleName);
       }
       final String typeName = sysLogQuery.getTypeName();
       if(StrUtil.isNotBlank(typeName)){
           queryWrapper.eq(SysLog::getTypeName,typeName);
       }
       final Integer status = sysLogQuery.getStatus();
       if(status != null){
           queryWrapper.eq(SysLog::getStatus,status);
       }
       final String operatorName = sysLogQuery.getOperatorName();
       if (StrUtil.isNotBlank(operatorName)) {
           queryWrapper.eq(SysLog::getOperatorName, operatorName);
       }
       LocalDateTime operateTimeBegin = sysLogQuery.getOperateTimeBegin();
       if(operateTimeBegin != null){    
           queryWrapper.ge(SysLog::getOperateTime,operateTimeBegin);
       }
       LocalDateTime operateTimeEnd = sysLogQuery.getOperateTimeEnd();
       if(operateTimeEnd != null){
           queryWrapper.le(SysLog::getOperateTime,operateTimeEnd);
       }
       
       queryWrapper.orderByDesc(SysLog::getId);
       return queryWrapper;
   }
}
