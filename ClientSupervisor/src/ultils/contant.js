import path from "./path";

export const SuperSidebar = [
  
  {
    id: 1,
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
      
    ],
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Manage Salary",
    path: `/${path.SUPER_LAYOUT}/${path.SALARY}`,
    icon: "sss",
  },
  {
    id: 3,
    type: "SINGLE",
    text: "Manage Booking",
    path: `/${path.SUPER_LAYOUT}/${path.MANAGE_BOOKING}`,
    icon: "sss",
  },
  
  
];
