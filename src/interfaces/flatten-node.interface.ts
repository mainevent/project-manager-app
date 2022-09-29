export interface FlattenNode {
  key: string,
  parent: FlattenNode,
  level: number,
  index: number,
  children: FlattenNode[],
  data: any,
  expanded: boolean,
  collapsed: boolean,
  selected: boolean,
  isEditing: boolean,
}