export default class BasicGroupInfo
{
  id: string;
  name: string;

  constructor(name: string, group_name: string)
  {
    this.id = name;
    this.name = group_name;
  }
}