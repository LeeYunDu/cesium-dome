/**
  * name:标题
  * fileName:文件名称
  * components:组件,
  * filePath: 文件路径
  */
import type { DefineComponent } from 'vue'
export interface children {
   name: string,
   fileName: string,
   filePath:string,
   components:DefineComponent<{}, {}, any>,
   meta:object,
 }

/**
  * title：导航栏标题
  * meta：扩展对象
  * children：文章列表
  * sort:导航栏排序依据 - 从小到大
  */
export interface module {
   title:string,
   meta:object,
   children:Array<children>,
   sort?:number
 }

export interface meta {
  sort?:number,
  title?:string
}
