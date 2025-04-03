"use client";
import Link from "next/link";
import Image from "next/image";

const navigationItems = [
  {
    path: "/teacher/information",
    image: (
      <Image src="/Male User.png" alt="User icon" width={18} height={18} />
    ),
    label: "Personal Information",
  },
  {
    path: "/teacher/classes",
    image: (
      <Image
        src="/Event Accepted.png"
        alt="Accepted icon"
        width={18}
        height={18}
      />
    ),
    label: "Scheduled Classes",
  },
  {
    path: "/teacher/regular",
    image: (
      <Image src="/Edit Property.png" alt="Edit icon" width={18} height={18} />
    ),
    label: "Regular Classes",
  },
  {
    path: "/teacher/pop-up",
    image: (
      <Image src="/Edit Property.png" alt="Edit icon" width={18} height={18} />
    ),
    label: "Pop Up Classes",
  },
  {
    path: "/teacher/workshop",
    image: (
      <Image src="/Edit Property.png" alt="Edit icon" width={18} height={18} />
    ),
    label: "Workshop Classes",
  },
  {
    path: "/teacher/showcase",
    image: (
      <Image src="/Edit Property.png" alt="Edit icon" width={18} height={18} />
    ),
    label: "Showcase Classes",
  },
];

export default function TeacherLayout({ children }) {
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
