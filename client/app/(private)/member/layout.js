"use client";
import Link from "next/link";
import Image from "next/image";

const navigationItems = [
  {
    path: "/member/information",
    image: (
      <Image src="/Male User.png" alt="User icon" width={18} height={18} />
    ),
    label: "Personal Information",
  },
  {
    path: "/member/classes",
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
    path: "/member/orders",
    image: <Image src="/Buy.png" alt="Buy icon" width={18} height={18} />,
    label: "Purchase History",
  },
  // {
  //   path: "/member/points",
  //   image: <Image src="/Prize.png" alt="Prize icon" width={18} height={18} />,
  //   label: "Points Redemption",
  // },
];

export default function MemberLayout({ children }) {
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
