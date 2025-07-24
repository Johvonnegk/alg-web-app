import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaHome, FaLeaf } from "react-icons/fa";
import { RiSurveyFill } from "react-icons/ri";
import { MdGroup, MdAdminPanelSettings } from "react-icons/md";
import { useAuth } from "@/context/AuthContext";
const iconSize = `!w-5.5 !h-5.5`;
const items = [
  {
    title: "Home",
    value: "overview",
    icon: <FaHome className={iconSize} />,
  },
  {
    title: "Groups",
    value: "groups",
    icon: <MdGroup className={iconSize} />,
  },
  {
    title: "Surveys",
    value: "surveys",
    icon: <RiSurveyFill className={iconSize} />,
  },
  {
    title: "Growth Tracks",
    value: "growth",
    icon: <FaLeaf className={iconSize} />,
  },
  {
    title: "Admin",
    value: "admin",
    icon: <MdAdminPanelSettings className={iconSize} />,
  },
];

export function AppSidebar({ profile, onSelect, selected }) {
  const { signOut } = useAuth();
  return (
    <Sidebar className="border-none mt-23 pl-4 h-[calc(100vh-7rem)]">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="flex justify-between bg-white rounded-md mb-6 shadow px-2 py-2 items-center">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col pr-3">
                <span className="text-xs font-semibold">
                  {profile.fname} {profile.lname}
                </span>
                <span className="text-xs text-stone-400 font-semibold">
                  {profile.email}
                </span>
              </div>
            </div>
            <hr className="text-stone-300" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map(({ title, value, icon }) => {
              if (value === "admin" && profile.role_id === 1) {
                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      className={`rounded-lg text-lg transition-[box-shadow,_background-color,_color] ${
                        selected === value
                          ? "text-accent border-0 bg-white shadow"
                          : "text-stone-500"
                      }`}
                      key={value}
                      onClick={() => onSelect(value)}
                    >
                      {icon}
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              } else if (value !== "admin") {
                return (
                  <SidebarMenuItem key={title}>
                    <SidebarMenuButton
                      className={`rounded-lg text-lg transition-[box-shadow,_background-color,_color] ${
                        selected === value
                          ? "text-accent border-0 bg-white shadow"
                          : "text-stone-500"
                      }`}
                      key={value}
                      onClick={() => onSelect(value)}
                    >
                      {icon}
                      <span>{title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              }
            })}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Button onClick={signOut} className="w-full btn-primary">
              Sign Out
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
