import { api } from '@/utils/request';

export type CpuInfo = {
  cpuModel: string;
  cpuNum: number;
  total: number;
  sys: number;
  used: number;
  wait: number;
  free: number;
};

export type MemoryInfo = {
  total: number;
  used: number;
  free: number;
  usage: number;
};

export type JvmInfo = {
  max: number;
  total: number;
  used: number;
  free: number;
  usage: number;
  name: string;
  version: string;
  vendor: string;
  home: string;
  userDir: string;
  startTime: string;
  runTime: string;
  inputArguments: string[];
};

export type SystemInfo = {
  osName: string;
  osArch: string;
  osVersion: string;
  computerName: string;
  computerIp: string;
};

export type DiskInfo = {
  diskName: string;
  diskType: string;
  dirName: string;
  total: string;
  free: string;
  used: string;
  usage: number;
};

export type ServerInfo = {
  cpu: CpuInfo;
  mem: MemoryInfo;
  jvm: JvmInfo;
  sys: SystemInfo;
  disks: DiskInfo[];
};

/**
 * 查询服务器监控聚合信息。
 *
 * @returns CPU、内存、JVM、系统和磁盘信息
 */
export function getServerInfo() {
  return api.get<ServerInfo>('/monitor/server/info');
}
