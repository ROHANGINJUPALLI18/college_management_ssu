"use client";

import React, { useState } from "react";
import {
  Search,
  LayoutDashboard,
  CheckSquare,
  Folder,
  Calendar,
  Users,
  BarChart3,
  FilePlus,
  Settings,
  User as UserIcon,
  ChevronDown,
  Plus,
  Filter,
  Clock,
  CircleDashed,
  CheckCircle2,
  Flag,
  Archive,
  Eye,
  FileText,
  Star,
  Users2,
  Projector,
  Share2,
  CloudUpload,
  Shield,
  Bell,
  Puzzle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/** ======================= UI Utils ======================= */
const softSpringEasing = "cubic-bezier(0.25, 1.1, 0.4, 1)";

/* ----------------------------- Brand / Logos ----------------------------- */

function SSULogoSquare() {
  return (
    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-[#f6b100] shadow-inner">
      <span className="text-[10px] font-black text-[#2f0a5e]">SSU</span>
    </div>
  );
}

function BrandBadge() {
  return (
    <div className="relative shrink-0 w-full mb-4 px-1">
      <div className="flex items-center gap-3 p-1 w-full rounded-xl hover:bg-white/5 transition-colors">
        <SSULogoSquare />
        <div className="flex flex-col">
          <div className="font-bold text-[14px] text-white leading-tight">
            SSU Portal
          </div>
          <div className="text-[10px] text-[#f6b100]/80 font-bold uppercase tracking-wider">
            Student Panel
          </div>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- Avatar -------------------------------- */

function AvatarCircle() {
  return (
    <div className="relative rounded-full shrink-0 size-8 bg-black">
      <div className="flex items-center justify-center size-8 bg-[#f6b100]/20 rounded-full border border-[#f6b100]/30 outline outline-2 outline-offset-2 outline-white/5">
        <UserIcon size={16} className="text-[#f6b100]" />
      </div>
    </div>
  );
}

/* ------------------------------ Search Input ----------------------------- */

function SearchContainer({ isCollapsed = false }: { isCollapsed?: boolean }) {
  const [searchValue, setSearchValue] = useState("");

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 mb-6 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`bg-white/5 border border-white/10 h-10 relative rounded-xl flex items-center transition-all duration-500 overflow-hidden ${
          isCollapsed ? "w-10 min-w-10 justify-center" : "w-full"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div
          className={`flex items-center justify-center shrink-0 transition-all duration-500 ${
            isCollapsed ? "p-1" : "px-3"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <Search size={16} className="text-white/40" />
        </div>

        <div
          className={`flex-1 relative transition-opacity duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className="w-full bg-transparent border-none outline-none text-[14px] text-white placeholder:text-white/30 leading-[20px]"
            tabIndex={isCollapsed ? -1 : 0}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------- Types / Content Map -------------------------- */

interface MenuItemT {
  icon?: React.ReactNode;
  label: string;
  hasDropdown?: boolean;
  isActive?: boolean;
  children?: MenuItemT[];
}
interface MenuSectionT {
  title: string;
  items: MenuItemT[];
}
interface SidebarContent {
  title: string;
  sections: MenuSectionT[];
}

function getSidebarContent(activeSection: string): SidebarContent {
  const contentMap: Record<string, SidebarContent> = {
    dashboard: {
      title: "Dashboard",
      sections: [
        {
          title: "My Overview",
          items: [
            { icon: <Eye size={16} />, label: "Academic Summary", isActive: true },
            {
              icon: <LayoutDashboard size={16} />,
              label: "Semester Insights",
              hasDropdown: true,
              children: [
                { label: "Attendance Report" },
                { label: "Grade Prediction" },
                { label: "Credit Summary" },
              ],
            },
          ],
        },
        {
          title: "Announcements",
          items: [
            {
              icon: <Bell size={16} />,
              label: "Recent Notices",
              hasDropdown: true,
              children: [
                { label: "Holiday on 15th Aug" },
                { label: "Exam Form Deadline" },
                { label: "Workshop Registration" },
              ],
            },
          ],
        },
      ],
    },

    tasks: {
      title: "Tasks",
      sections: [
        {
          title: "Academics",
          items: [
            { icon: <Plus size={16} />, label: "New Assignment" },
            { icon: <Filter size={16} />, label: "Filter Tasks" },
          ],
        },
        {
          title: "My Progress",
          items: [
            {
              icon: <Clock size={16} />,
              label: "Upcoming Deadlines",
              hasDropdown: true,
              children: [
                { icon: <Flag size={14} />, label: "Math Assignment" },
                { icon: <CheckSquare size={14} />, label: "Lab Report" },
              ],
            },
          ],
        },
      ],
    },

    projects: {
      title: "Projects",
      sections: [
        {
          title: "Final Year Projects",
          items: [
            { icon: <Plus size={16} />, label: "Project Idea" },
            { icon: <Folder size={16} />, label: "My Projects" },
          ],
        },
      ],
    },

    calendar: {
      title: "Calendar",
      sections: [
        {
          title: "Academic Schedule",
          items: [
            { icon: <Eye size={16} />, label: "Monthly Calendar" },
            { icon: <Calendar size={16} />, label: "Holiday List" },
          ],
        },
      ],
    },

    settings: {
      title: "Settings",
      sections: [
        {
          title: "Security",
          items: [
            { icon: <Shield size={16} />, label: "Change Password" },
            { icon: <Users size={16} />, label: "Profile Info" },
          ],
        },
      ],
    },
  };

  return contentMap[activeSection] || contentMap.dashboard;
}

/* ---------------------------- Left Icon Nav Rail -------------------------- */

function IconNavButton({
  children,
  isActive = false,
  onClick,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`flex items-center justify-center rounded-xl size-10 min-w-10 transition-all duration-300
        ${isActive ? "bg-[#f6b100] text-[#2f0a5e] shadow-lg shadow-[#f6b100]/20" : "hover:bg-white/10 text-white/50 hover:text-white"}`}
      style={{ transitionTimingFunction: softSpringEasing }}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function IconNavigation({
  activeSection,
  onSectionChange,
}: {
  activeSection: string;
  onSectionChange: (section: string) => void;
}) {
  const navItems = [
    { id: "dashboard", icon: <LayoutDashboard size={18} />, label: "Dashboard" },
    { id: "tasks", icon: <CheckSquare size={18} />, label: "Tasks" },
    { id: "projects", icon: <Projector size={18} />, label: "Projects" },
    { id: "calendar", icon: <Calendar size={18} />, label: "Calendar" },
    { id: "teams", icon: <Users size={18} />, label: "Teams" },
    { id: "analytics", icon: <BarChart3 size={18} />, label: "Analytics" },
    { id: "files", icon: <FileText size={18} />, label: "Files" },
  ];

  return (
    <aside className="bg-[#2f0a5e] flex flex-col gap-3 items-center p-3 w-16 h-full border-r border-white/5">
      {/* Logo */}
      <div className="mb-4 size-10 flex items-center justify-center">
        <SSULogoSquare />
      </div>

      {/* Navigation Icons */}
      <div className="flex flex-col gap-2 w-full items-center">
        {navItems.map((item) => (
          <IconNavButton
            key={item.id}
            isActive={activeSection === item.id}
            onClick={() => onSectionChange(item.id)}
          >
            {item.icon}
          </IconNavButton>
        ))}
      </div>

      <div className="flex-1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-3 w-full items-center">
        <IconNavButton isActive={activeSection === "settings"} onClick={() => onSectionChange("settings")}>
          <Settings size={18} />
        </IconNavButton>
        <AvatarCircle />
      </div>
    </aside>
  );
}

/* ------------------------------ Right Sidebar ----------------------------- */

function SectionTitle({
  title,
  onToggleCollapse,
  isCollapsed,
}: {
  title: string;
  onToggleCollapse: () => void;
  isCollapsed: boolean;
}) {
  return (
    <div className={`w-full overflow-hidden transition-all duration-500 mb-4`} style={{ transitionTimingFunction: softSpringEasing }}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center h-10 transition-opacity duration-300 ${isCollapsed ? "opacity-0 w-0" : "opacity-100"}`}>
          <div className="px-1">
            <div className="font-bold text-[18px] text-white leading-[27px]">
              {title}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={onToggleCollapse}
          className="flex items-center justify-center rounded-xl size-10 transition-all duration-500 hover:bg-white/10 text-white/40 hover:text-white"
          style={{ transitionTimingFunction: softSpringEasing }}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
    </div>
  );
}

function DetailSidebar({ activeSection }: { activeSection: string }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isCollapsed, setIsCollapsed] = useState(false);
  const content = getSidebarContent(activeSection);

  const toggleExpanded = (itemKey: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemKey)) next.delete(itemKey);
      else next.add(itemKey);
      return next;
    });
  };

  const toggleCollapse = () => setIsCollapsed((s) => !s);

  return (
    <aside
      className={`bg-[#3d1a75] flex flex-col items-start p-4 transition-all duration-500 h-full ${
        isCollapsed ? "w-16 min-w-16 items-center" : "w-64"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      {!isCollapsed && <BrandBadge />}

      <SectionTitle title={content.title} onToggleCollapse={toggleCollapse} isCollapsed={isCollapsed} />
      <SearchContainer isCollapsed={isCollapsed} />

      <div
        className={`flex-1 flex flex-col w-full overflow-y-auto overflow-x-hidden scrollbar-none transition-all duration-500 ${
          isCollapsed ? "gap-2 items-center" : "gap-4 items-start"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        {content.sections.map((section, index) => (
          <MenuSection
            key={`${activeSection}-${index}`}
            section={section}
            expandedItems={expandedItems}
            onToggleExpanded={toggleExpanded}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      {!isCollapsed && (
        <div className="w-full mt-auto pt-4 border-t border-white/5 group">
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer">
            <AvatarCircle />
            <div className="flex flex-col min-w-0">
              <div className="text-[13px] font-bold text-white truncate">Student Portal</div>
              <div className="text-[11px] text-white/40 truncate">Active Session</div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}

/* ------------------------------ Menu Elements ---------------------------- */

function MenuItem({
  item,
  isExpanded,
  onToggle,
  onItemClick,
  isCollapsed,
}: {
  item: MenuItemT;
  isExpanded?: boolean;
  onToggle?: () => void;
  onItemClick?: () => void;
  isCollapsed?: boolean;
}) {
  const handleClick = () => {
    if (item.hasDropdown && onToggle) onToggle();
    else onItemClick?.();
  };

  return (
    <div
      className={`relative shrink-0 transition-all duration-500 ${
        isCollapsed ? "w-full flex justify-center" : "w-full"
      }`}
      style={{ transitionTimingFunction: softSpringEasing }}
    >
      <div
        className={`rounded-xl cursor-pointer transition-all duration-300 flex items-center relative ${
          item.isActive ? "bg-[#f6b100]/15 text-[#f6b100]" : "hover:bg-white/5 text-white/60 hover:text-white"
        } ${isCollapsed ? "w-10 min-w-10 h-10 justify-center p-0" : "w-full h-11 px-3 py-2"}`}
        style={{ transitionTimingFunction: softSpringEasing }}
        onClick={handleClick}
        title={isCollapsed ? item.label : undefined}
      >
        <div className={`flex items-center justify-center shrink-0 ${item.isActive ? "text-[#f6b100]" : "text-inherit"}`}>
           {item.icon}
        </div>

        <div
          className={`flex-1 relative transition-all duration-500 overflow-hidden ${
            isCollapsed ? "opacity-0 w-0" : "opacity-100 ml-3"
          }`}
          style={{ transitionTimingFunction: softSpringEasing }}
        >
          <div className="font-bold text-[13px] leading-[20px] truncate">
            {item.label}
          </div>
        </div>

        {item.hasDropdown && !isCollapsed && (
          <div
            className={`flex items-center justify-center shrink-0 transition-opacity duration-300 ml-2`}
          >
            <ChevronDown
              size={14}
              className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function SubMenuItem({ item, onItemClick }: { item: MenuItemT; onItemClick?: () => void }) {
  return (
    <div className="w-full pl-10 pr-1 py-[2px]">
      <div
        className="h-9 w-full rounded-lg cursor-pointer transition-colors hover:bg-white/5 flex items-center px-3"
        onClick={onItemClick}
      >
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[12px] text-white/40 hover:text-white/80 transition-colors leading-[18px] truncate">
            {item.label}
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuSection({
  section,
  expandedItems,
  onToggleExpanded,
  isCollapsed,
}: {
  section: MenuSectionT;
  expandedItems: Set<string>;
  onToggleExpanded: (itemKey: string) => void;
  isCollapsed?: boolean;
}) {
  return (
    <div className="flex flex-col w-full">
      <div
        className={`relative shrink-0 w-full transition-all duration-500 overflow-hidden ${
          isCollapsed ? "h-0 opacity-0 mb-0" : "h-8 opacity-100 mb-1"
        }`}
        style={{ transitionTimingFunction: softSpringEasing }}
      >
        <div className="flex items-center h-full px-3">
          <div className="font-bold text-[10px] uppercase tracking-widest text-white/20">
            {section.title}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        {section.items.map((item, index) => {
          const itemKey = `${section.title}-${index}`;
          const isExpanded = expandedItems.has(itemKey);
          return (
            <div key={itemKey} className="w-full flex flex-col">
              <MenuItem
                item={item}
                isExpanded={isExpanded}
                onToggle={() => onToggleExpanded(itemKey)}
                onItemClick={() => console.log(`Clicked ${item.label}`)}
                isCollapsed={isCollapsed}
              />
              {isExpanded && item.children && !isCollapsed && (
                <div className="flex flex-col gap-0.5 mt-1">
                   {item.children.map((child, childIndex) => (
                    <SubMenuItem
                      key={`${itemKey}-${childIndex}`}
                      item={child}
                      onItemClick={() => console.log(`Clicked ${child.label}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* --------------------------------- Layout -------------------------------- */

function TwoLevelSidebar() {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex flex-row h-[780px] rounded-2xl overflow-hidden shadow-2xl">
      <IconNavigation activeSection={activeSection} onSectionChange={setActiveSection} />
      <DetailSidebar activeSection={activeSection} />
    </div>
  );
}

/* ------------------------------- Main Export ------------------------------ */

export function TwoLevelSSUSidebar() {
  return (
    <TwoLevelSidebar />
  );
}

export default TwoLevelSSUSidebar;
