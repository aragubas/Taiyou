import BasicGroupInfo from "./BasicGroupInfo";

export default class GetGroupsResponse
{
  groups: Array<BasicGroupInfo>;

  constructor(groups: Array<BasicGroupInfo>)
  {
    this.groups = groups;
  }
}