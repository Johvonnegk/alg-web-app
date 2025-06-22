export interface GroupMember {
  role_id: number;
  users: { fname: string; lname: string; email?: string };
  groups: { name: string; id?: number };
}

export interface Groups {
  name: string;
  description: string;
  created_at: string;
  users: { fname: string; lname: string; role_id: number };
}
