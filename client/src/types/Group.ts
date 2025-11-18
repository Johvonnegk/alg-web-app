export interface GroupMember {
  role_id: number;
  users: {
    user_id?: string;
    fname: string;
    lname: string;
    role_id?: number;
    email?: string;
    profile_icon?: string;
  };
  groups: { name: string; id?: number; description: string };
}

export interface Groups {
  id?: number;
  name: string;
  description: string;
  created_at: string;
  users: { fname: string; lname: string; role_id: number; email?: string };
}

export type Attendee = {
  id: string;
  email: string;
  fname: string;
  lname: string;
  defaultAttendance: "present" | "absent" | "late" | "excused";
};
