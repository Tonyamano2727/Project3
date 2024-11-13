import path from "./path";

export const SuperSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Over View",
    path: `/${path.SUPER_LAYOUT}/${path.OVER_VIEW}`,
    icon: "sss",
  },

  {
    id: 2,
    type: "PARENT",
    text: "Manage Employee",
    icon: "sss",
    submenu: [
      {
        text: "Manage Employee",
        path: `/${path.SUPER_LAYOUT}/${path.MANAGE_EMPLOYYEE}`,
      },
      {
        text: "Create Employee ",
        path: `/${path.SUPER_LAYOUT}/${path.CREATED_EMPLOYYEE}`,
      },
      {
        text: "Manage Salary",
        path: `/${path.SUPER_LAYOUT}/${path.SALARY}`,
      },
    ],
  },

  {
    id: 3,
    type: "PARENT",
    text: "Manage Booking",
    icon: "sss",
    submenu: [
      {
        text: "Manage Booking",
        path: `/${path.SUPER_LAYOUT}/${path.MANAGE_BOOKING}`,
      },
    ],
  },
];
