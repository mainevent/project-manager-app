import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FlattenNode } from 'src/interfaces/flatten-node.interface';
import { EditNodeComponent } from '../edit-node/edit-node.component';

@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {

  flattenNodes: any[] = [];

  projects: any[] = [];

  deepestLevel = 0;

  dataUrl = 'assets/mocks/data.json';

  constructor(
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog,
    private http: HttpClient,
  ) {
    this.getData();
  }

  getData() {
    this.http.get(this.dataUrl).subscribe((data: any) => {
      this.mapProjects(data.projects);
    })
  }

  mapProjects(data: any) {
    let projectTasks: FlattenNode[] = [];
    const flattenData = (nodes: any, parent: any | null = null) => {
      return nodes.map((node: any, index: number) => {
        const flattenNode: FlattenNode = {
          key: `${parent ? parent.level + 1 : 0}-${index}`,
          parent,
          level: parent ? parent.level + 1 : 0,
          index,
          children: [],
          data: node,
          expanded: false,
          collapsed: true,
          selected: false,
          isEditing: false,
        }

        this.deepestLevel = flattenNode.level > this.deepestLevel ? flattenNode.level : this.deepestLevel;

        projectTasks.push(flattenNode);

        flattenNode.children = flattenData(node.children || [], flattenNode);

        return flattenNode;
      })
    }

    this.projects = data.map((project: any) => {
      projectTasks = [];
      const t = flattenData(project.tasks, null)
      return ({
        id: project.id,
        name: project.name,
        tasks: projectTasks,
      });
    })
    this.cdr.detectChanges();
  }

  toggleNode(node: any) {
    console.log(node)
    if (node.children.length > 0) {
      node.collapsed = !node.collapsed;
    }

    node.children.forEach((node: any) => {
      node.expanded = !node.expanded;
    })
  }

  showNode(node: any) {
    if (!node.parent) {
      return true;
    }

    let currentNode = node;
    let isVisible = true;

    while (currentNode) {
      isVisible = !currentNode.parent?.collapsed;
      currentNode = currentNode.parent;
      if (!isVisible) {
        currentNode = null;
      }
    }
    return isVisible;
  }

  deleteNode(treeNode: FlattenNode, tasks: FlattenNode[]) {
    const deletedLevel = treeNode.level;
    const parent = treeNode.parent;
    if (parent) {
      parent.children = parent.children?.filter(node => node.key !== treeNode.key);
    }
    const deletedIndex = tasks.findIndex((node: any) => node.key === treeNode.key);
    tasks.splice(deletedIndex, 1);


    const keysToDelete: string[] = [];

    for (let i = deletedIndex; i < tasks.length; i++) {
      const node = tasks[i];
      if (deletedLevel < node.level) {
        keysToDelete.push(node.key)
      }
    }
    tasks = tasks.filter((node: any) => keysToDelete.indexOf(node.key) < 0);
  }

  addNode(key: string, tasks: FlattenNode[]) {
    const dialogRef = this.dialog.open(EditNodeComponent, {});

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        const parentNodeIndex = tasks.findIndex(node => node.key === key);
        const parentNode = tasks[parentNodeIndex];
        const newNode: FlattenNode = {
          key: `${parentNode.level + 1}-${parentNode.children.length}`,
          parent: parentNode,
          level: parentNode ? parentNode.level + 1 : 0,
          index: parentNode.children.length,
          children: [],
          data,
          expanded: false,
          collapsed: true,
          selected: false,
          isEditing: false,
        };

        parentNode.children.push(newNode);
        tasks.splice(parentNodeIndex + 1, 0, newNode);
        this.cdr.detectChanges();
      }
    })
  }

  editNode(node: FlattenNode) {
    const dialogRef = this.dialog.open(EditNodeComponent, {
      data: {
        name: node.data.name,
        description: node.data.description,
        status: node.data.status,
      }
    });

    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        node.data = {
          ...node.data,
          name: data.name,
          description: data.description,
          status: data.status,
        }
      }
      this.cdr.detectChanges();
    })
  }

  deleteSelectedNodes(tasks: FlattenNode[]) {
    const nodesToDelete = tasks
      .filter(node => node.selected);

    nodesToDelete.forEach((node: FlattenNode) => {
      if (node.parent) {
        node.parent.children = node.parent.children.filter((childNode) => node.key !== childNode.key);
      }
    })

    tasks = tasks
      .filter(node => nodesToDelete.map(node => node.key)
        .indexOf(node.key) < 0);
  }
}
