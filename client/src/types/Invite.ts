export interface Invite {
  id: number;
  status: string;
  type: string;
  sender: {
    fname: string;
    lname: string;
  };
  recipient: {
    fname: string;
    lname: string;
  };
  groups: {
    name: string;
  };
  created_at: string;
  updated_at: string;
}
