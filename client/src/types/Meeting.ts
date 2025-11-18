export interface Meeting {
  id: string;
  group_id: number;
  date: Date;
  location: string;
  title: string;
  notes: string;
  users?: { user_id: string; fname: string; lname: string; role_id: number };
  attendances: [
    {
      meeting_id: string;
      users: { user_id: string; fname: string; lname: string; email: string };
      attendance: "present" | "absent" | "late" | "excused";
    }
  ];
}
