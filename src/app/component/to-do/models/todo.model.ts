import { Column } from "./column.model";

export class TodoBoard{
  constructor(public name: string, public columns: Column[]) {}
}
