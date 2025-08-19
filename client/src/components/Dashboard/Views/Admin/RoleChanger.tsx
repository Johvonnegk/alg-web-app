import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { rolesSelect } from "@/types/SystemRoles";
import { UserProfile } from "@/types/UserProfile";
export function RoleChanger({
  member,
  email,
  onChange,
}: {
  member: UserProfile;
  email: string;
  onChange: (newRole: string) => void;
}) {
  const [selectedRole, setSelectedRole] = useState<string | undefined>();

  return (
    <div className="flex space-x-2">
      <Select onValueChange={setSelectedRole}>
        <SelectTrigger className="w-auto border-accent text-accent shadow-sm">
          <SelectValue placeholder="System Role" />
        </SelectTrigger>
        <SelectContent className="bg-white">
          {rolesSelect.map((role) => (
            <SelectItem
              disabled={role.value === member.role_id}
              key={role.value}
              value={String(role.value)}
            >
              {role.display}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        className="shadow-md btn-primary"
        onClick={() => selectedRole && onChange(selectedRole)}
        disabled={!selectedRole}
      >
        Change
      </Button>
    </div>
  );
}
