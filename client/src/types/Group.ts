export interface GroupMember {
  role_id: number;
  users: { fname: string; lname: string; role_id?: number; email?: string };
  groups: { name: string; id?: number };
}

export interface Groups {
  id?: number;
  name: string;
  description: string;
  created_at: string;
  users: { fname: string; lname: string; role_id: number; email?: string };
}
