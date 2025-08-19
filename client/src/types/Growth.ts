export interface Growth {
  email?: string;
  course_name: string;
  completed_at?: string;
  status: string;
}

export interface GrowthGroups {
  groupId?: number;
  course_name: string;
  completed_at: string;
  status: string;
  user: { fname: string; lname: string; email: string; role_id: number };
}
