export interface fileFields {
  id:string,
  suffix:string, // 文件后缀,相对准确
  type:string, // 文件类型,也不是很准确
  fileName:string, // 文件名称
  filePath:string, // 文件路径
  fileBucketName:string, // 项目标识库?不确定是否是唯一值
  createTime:string,
  delFlag:string, // 是否删除
}
