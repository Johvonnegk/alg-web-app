export interface GroupMember {
  user_id: string;
  role_id: number;
  users: { fname: string; lname: string };
  groups: { name: string; id?: number };
}
