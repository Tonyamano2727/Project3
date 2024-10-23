import path from "./path";
import icons from "./icons";
import houseicon from "../assets/houseicon.png";
import houseicon2 from "../assets/houseicon2.png";
import houseicon3 from "../assets/houseicon3.png";
import houseicon4 from "../assets/houseicon4.png";
import houseicon5 from "../assets/houseicon5.png";
import clean from "../assets/clean.png";
import clean2 from "../assets/clean2.png";
import clean3 from "../assets/clean3.png";
import workicon from "../assets/workicon.png";
import workicon2 from "../assets/workicon2.png";
import workicon3 from "../assets/workicon3.png";
import workgalary from "../assets/workgalary.png";
import workgalary2 from "../assets/workgalary2.png";

export const Icon = [
  {
    id: 1,
    imageSrc: houseicon,
    title : "View details",
  },
  {
    id: 2,
    imageSrc: houseicon2,
    title : "View details",
  },
  {
    id: 3,
    imageSrc: houseicon3,
    title : "View details",
  },
  {
    id: 4,
    imageSrc: houseicon4,
    title : "View details",
  },
  {
    id: 5,
    imageSrc: houseicon5,
    title : "View details",
  },
];

export const Workgalarydata = [
  {
    id: 1,
    imageSrc: clean,
    location: "USA",
    title: "House Floor Cleaning",
  },
  {
    id: 2,
    imageSrc: clean2,
    location: "USA",
    title: "House Floor Cleaning",
  },
  {
    id: 3,
    imageSrc: workgalary,
    location: "USA",
    title: "House Floor Cleaning",
  },
  {
    id: 4,
    imageSrc: workgalary2,
    location: "USA",
    title: "House Floor Cleaning",
  },
];

export const StepsData = [
  {
    stepNumber: 1,
    title: "Find Us Online",
    description: "Repurpose go forward benefits more conveniently e-business",
    icon: workicon,
    linePosition: "left-[270px]",
  },
  {
    stepNumber: 2,
    title: "Choose Services",
    description: "Repurpose go forward benefits more conveniently e-business",
    icon: workicon2,
    linePosition: "right-[240px]",
  },
  {
    stepNumber: 3,
    title: "Book Appointment",
    description: "Repurpose go forward benefits more conveniently e-business",
    icon: workicon3,
    linePosition: "",
  },
];

export const serviceData = [
  {
    id: 1,
    imgSrc: clean,
    iconSrc: houseicon,
    title: "House Wash & Clean",
    details: ["House Floor cleeny", "Roof Clean & Wash"],
  },
  {
    id: 2,
    imgSrc: clean2,
    iconSrc: houseicon2,
    title: "House Wash & Clean",
    details: ["House Floor cleeny", "Roof Clean & Wash"],
  },
  {
    id: 3,
    imgSrc: clean3,
    iconSrc: houseicon3,
    title: "House Wash & Clean",
    details: ["House Floor cleeny", "Roof Clean & Wash"],
  },
];

export const cleaningData = [
  {
    id: 1,
    imgSrc: houseicon,
    title: "House Cleaning",
    description: "Competently repurpose clean conveniently target",
  },
  {
    id: 2,
    imgSrc: houseicon2,
    title: "Window Cleaning",
    description: "Competently repurpose clean conveniently target",
  },
  {
    id: 3,
    imgSrc: houseicon3,
    title: "Office Cleaning",
    description: "Competently repurpose clean conveniently target",
  },
];
export const navigation = [
  {
    id: 1,
    value: "Home",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "Products",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "Service",
    path: `/${path.OUR_SERVICES}`,
  },
  {
    id: 4,
    value: "Our Team",
    path: `/${path.OUR_TEAM}`,
  },
  {
    id: 5,
    value: "Blogs",
    path: `/${path.BLOGS}`,
  },
  {
    id: 6,
    value: "Contact",
    path: `/${path.FAQ}`,
  },
];

export const Productinfortabs = [
  {
    id: 1,
    title: "DESCTIPTION",
  },
  {
    id: 2,
    title: "WARRANTY",
    
  },
  {
    id: 3,
    title: "CUSTOM REVIEW",
  },
  
];

export const colors = [
  "Black",
  "White",
  "Blue",
  "GOLD",
  "Pink",
  "Purple",
  "Green",
];

export const sorts = [
  {
    id: 1,
    value: "-sold",
    text: "Best selling",
  },
  {
    id: 2,
    value: "-title",
    text: "Alphabetically , A-Z",
  },
  {
    id: 3,
    value: "title",
    text: "Alphabetically , Z-A",
  },
  {
    id: 4,
    value: "-price",
    text: "Price, high to low",
  },
  {
    id: 5,
    value: "price",
    text: "Price, low to high",
  },
  {
    id: 6,
    value: "-createdAt",
    text: "Date, new to old",
  },
  {
    id: 7,
    value: "createdAt",
    text: "Date, old to new",
  },
];

export const sortsuser = [
  {
    id: 1,
    value: "isBlocked:true",
    text: "Blocked Users",
  },
  {
    id: 2,
    value: "isBlocked:false",
    text: "Active Users",
  },
];

export const sortByDate = [
  {
    id: 1,
    value: "-createdAt",
    text: "Date, new to old",
  },
  {
    id: 2,
    value: "createdAt",
    text: "Date, old to new", 
  },
];

export const sortsupervisor = [
  {
    id: 1,
    value: "District 1",
    text: "District 1",
  },
  {
    id: 2,
    value: "District 2",
    text: "District 2",
  },
  {
    id: 3,
    value: "District 3",
    text: "District 3",
  },
  {
    id: 4,
    value: "District 4",
    text: "District 4",
  },
  {
    id: 5,
    value: "District 5",
    text: "District 5",
  },
  {
    id: 6,
    value: "District 6",
    text: "District 6",
  },
  {
    id: 7,
    value: "District 7",
    text: "District 7",
  },
  {
    id: 8,
    value: "District 8",
    text: "District 8",
  },
  {
    id: 9,
    value: "District 9",
    text: "District 9",
  },
  {
    id: 10,
    value: "District 10",
    text: "District 10",
  },
  {
    id: 11,
    value: "District 11",
    text: "District 11",
  },
  {
    id: 12,
    value: "District 12",
    text: "District 12",
  },
  
];


const { FaUsers , TbBrandProducthunt, FaRegMoneyBillAlt , MdOutlineGridView } = icons;

export const AdminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Over View",
    path: `/${path.ADMIN}/${path.OVER_VIEW}`,
    icon: <MdOutlineGridView />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Manage users",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <FaUsers  />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Manage Supervise",
    icon: <TbBrandProducthunt />,
    submenu: [
      {
        text: "Create Supervise",
        path: `/${path.ADMIN}/${path.CREATE_SUPERVISE}`,
      },
      {
        text: "Manage Supervise",
        path: `/${path.ADMIN}/${path.MANAGE_SUPERVISE}`,
      },
    ],
  },
  {
    id: 4,
    type: "PARENT",
    text: "Manage products",
    icon: <TbBrandProducthunt />,
    submenu: [
      {
        text: "Create product",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
      },
      {
        text: "Manage Products",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 5,
    type: "PARENT",
    text: "Manage Blogs",
    icon: <TbBrandProducthunt />,
    submenu: [
      {
        text: "Create Blogs",
        path: `/${path.ADMIN}/${path.CREATE_BLOGS}`,
      },
      {
        text: "Manage Blogs",
        path: `/${path.ADMIN}/${path.MANAGE_BLOGS}`,
      },
    ],
  },
  {
    id: 6,
    type: "PARENT",
    text: "Manage Services",
    icon: <TbBrandProducthunt />,
    submenu: [
      {
        text: "Create Services",
        path: `/${path.ADMIN}/${path.CREATE_SERVICES}`,
      },
      {
        text: "Manage Services",
        path: `/${path.ADMIN}/${path.MANAGE_SERVICES}`,
      },
    ],
  },
  {
    id: 7,
    type: "SINGLE",
    text: "Manage order",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <FaRegMoneyBillAlt />,
  },
  {
    id: 8,
    type: "SINGLE",
    text: "Manage booking",
    path: `/${path.ADMIN}/${path.MANAGE_BOOKING}`,
    icon: <FaRegMoneyBillAlt />,
  },
  {
    id: 8,
    type: "SINGLE",
    text: "Profile",
    path: `/${path.ADMIN}/${path.PROFILE_ADMIN}`,
    icon: <FaRegMoneyBillAlt />,
  },
];

export const membersidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "PERSONAL",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <FaUsers  />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "My cart",
    path: `/${path.MEMBER}/${path.MY_CART}`,
    icon: <TbBrandProducthunt />,
  },
  {
    id: 3,
    type: "SINGLE",
    text: "WHISLISH",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <FaRegMoneyBillAlt />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Buy history",
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <FaRegMoneyBillAlt />,
  },
];

export const roles = [
  {
    code: 1945,
    value: "Admin",
  },
  {
    code: 1979,
    value: "User",
  },
];

export const statusOptions = [
  { value: "Pending", text: "Pending" },
  { value: "Processing", text: "Processing" },
  { value: "Shipped", text: "Shipped" },
  { value: "Successed", text: "Successed" },
  { value: "Cancelled", text: "Cancelled" },
];


export const statusOptionsBooking = [
  { value: "Pending", text: "Pending" },
  { value: "Confirmed", text: "Confirmed" },
  { value: "In-progress", text: "In-progress" },
  { value: "Completed", text: "Completed" },
  { value: "Cancelled", text: "Cancelled" },
];
 