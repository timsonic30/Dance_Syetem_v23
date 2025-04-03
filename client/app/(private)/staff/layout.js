"use client";
import Link from "next/link";
import Image from "next/image";

const navigationItems = [
  {
    path: "/staff/information",
    image: (
      <Image src="/Male User.png" alt="User icon" width={18} height={18} />
    ),
    label: "My Profile",
  },
  {
    path: "/staff/members",
    image: <Image src="/Member.png" alt="Member icon" width={18} height={18} />,
    label: "Members",
  },
  {
    path: "/staff/teachers",
    image: (
      <Image src="/Classroom.png" alt="Classroom icon" width={18} height={18} />
    ),
    label: "Teacher Enrollment",
  },
  {
    path: "/staff/classes",
    image: (
      <Image src="/Edit Property.png" alt="Edit icon" width={18} height={18} />
    ),
    label: "Create Class",
  },
  {
    path: "/staff/AllClassList",
    image: (
      <Image
        src="/Edit Property.png"
        alt="Fat Female icon"
        width={18}
        height={18}
      />
    ),
    label: "All Class List",
  },
  {
    path: "/staff/teachers/registrations_v4",
    image: (
      <Image
        src="/Body Positive Female.png"
        alt="Fat Female icon"
        width={18}
        height={18}
      />
    ),
    label: "Teacher Registration",
  },
  {
    path: "/staff/ListCompApply",
    image: (
      <Image src="/Trophy.png" alt="Fat Female icon" width={18} height={18} />
    ),
    label: "Competitions Registered",
  },
];

export default function StaffLayout({ children }) {
  return (
    <div className="drawer lg:drawer-open">
      <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center">
        {/* Page content here */}
        {children}
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer-2"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
          {/* Sidebar content here */}
          {navigationItems.map((item) => (
            <li key={item.path}>
              <Link
                className={`text-lg focus:text-neutral-content focus:bg-neutral`}
                href={item.path}
              >
                {item.image} {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
