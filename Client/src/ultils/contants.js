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
    title: "View details",
  },
  {
    id: 2,
    imageSrc: houseicon2,
    title: "View details",
  },
  {
    id: 3,
    imageSrc: houseicon3,
    title: "View details",
  },
  {
    id: 4,
    imageSrc: houseicon4,
    title: "View details",
  },
  {
    id: 5,
    imageSrc: houseicon5,
    title: "View details",
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
    title: "Services Cleaning",
    description: "Home cleaning solutions for busy people",
    path: `/${path.OUR_SERVICES}`,
  },
  {
    id: 2,
    imgSrc: houseicon2,
    title: "Home Cleaning Products",
    description: "Optimize home cleaning time for housewives",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    imgSrc: houseicon3,
    title: "Home cleaning blogs",
    description: "Detailed instructions on how to clean your home",
    path: `/${path.BLOGS}`,
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
  // {
  //   id: 4,
  //   value: "Serviceplan",
  //   path: `/${path.SERVICES__PLAN}`,
  // },
  {
    id: 5,
    value: "Our Team",
    path: `/${path.OUR_TEAM}`,
  },
  {
    id: 6,
    value: "Blogs",
    path: `/${path.BLOGS}`,
  },
  {
    id: 7,
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

const { FaUsers, TbBrandProducthunt, FaRegMoneyBillAlt, MdOutlineGridView } =
  icons;

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
    icon: <FaUsers />,
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
        text: "Create Category Services",
        path: `/${path.ADMIN}/${path.CATEGORY_SERVICES}`,
      },
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
    type: "PARENT",
    text: "Manage booking",
    icon: <FaRegMoneyBillAlt />,
    submenu: [
      {
        text: "Manage Hotdistric",
        path: `/${path.ADMIN}/${path.MANAGE_HOTDISTRIC}`,
      },
      {
        text: "Manage booking",
        path: `/${path.ADMIN}/${path.MANAGE_BOOKING}`,
      },
    ],
  },
  {
    id: 9,
    type: "SINGLE",
    text: "Managecounsel",
    path: `/${path.ADMIN}/${path.MANAGE_COUNSEL}`,
    icon: <FaRegMoneyBillAlt />,
  },
  {
    id: 10,
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
    icon: <FaUsers />,
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

export const wardsByDistrict = {
  "District 1": [
    "Ward Bến Nghé",
    "Ward Bến Thành",
    "Ward Nguyễn Thái Bình",
    "Ward Phạm Ngũ Lão",
    "Ward Cô Giang",
    "Ward Đa Kao",
    "Ward Nguyễn Cư Trinh",
    "Ward Tân Định",
  ],
  "District 2": [
    "Ward An Khánh",
    "Ward An Phú",
    "Ward Bình An",
    "Ward Bình Trưng Đông",
    "Ward Cát Lái",
    "Ward Thảo Điền",
    "Ward Thạnh Mỹ Lợi",
  ],
  "District 3": [
    "Ward 1",
    "Ward 2",
    "Ward 3",
    "Ward Võ Thị Sáu",
    "Ward Nguyễn Thái Bình",
    "Ward 6",
    "Ward 7",
  ],
  "District 4": ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"],
  "District 5": ["Ward 1", "Ward 2", "Ward 3", "Ward 4", "Ward 5"],
  "District 6": ["Ward 1", "Ward 2", "Ward 3", "Ward 4"],
  "District 7": ["Ward Tân Hưng", "Ward Tân Kiểng", "Ward Tân Thuận Đông"],
  "District 8": ["Ward 1", "Ward 2", "Ward 3"],
  "District 9": [
    "Ward Long Bình",
    "Ward Long Phước",
    "Ward Long Thạnh Mỹ",
    "Ward Long Trường",
    "Ward Phú Hữu",
    "Ward Tân Phú",
    "Ward Tăng Nhơn Phú A",
    "Ward Tăng Nhơn Phú B",
    "Ward Trường Thạnh",
    "Ward Hiệp Phú",
    "Ward Phước Bình",
    "Ward Phước Long A",
    "Ward Phước Long B",
  ],
  "District 10": [
    "Ward 1",
    "Ward 2",
    "Ward 3",
    "Ward 4",
    "Ward 5",
    "Ward 6",
    "Ward 7",
    "Ward 8",
    "Ward 9",
    "Ward 10",
    "Ward 11",
    "Ward 12",
    "Ward 13",
    "Ward 14",
    "Ward 15",
  ],
  "District 11": [
    "Ward 1",
    "Ward 2",
    "Ward 3",
    "Ward 4",
    "Ward 5",
    "Ward 6",
    "Ward 7",
    "Ward 8",
    "Ward 9",
    "Ward 10",
    "Ward 11",
    "Ward 12",
    "Ward 13",
    "Ward 14",
    "Ward 15",
    "Ward 16",
  ],
  "District 12": [
    "Ward An Phú Đông",
    "Ward Đông Hưng Thuận",
    "Ward Hiệp Thành",
    "Ward Tân Chánh Hiệp",
    "Ward Tân Hưng Thuận",
    "Ward Tân Thới Hiệp",
    "Ward Tân Thới Nhất",
    "Ward Thạnh Lộc",
    "Ward Thạnh Xuân",
    "Ward Trung Mỹ Tây",
  ],
  "District Bình Thạnh": [
    "Ward 1",
    "Ward 2",
    "Ward 3",
    "Ward 5",
    "Ward 6",
    "Ward 7",
    "Ward 11",
    "Ward 12",
    "Ward 13",
    "Ward 14",
    "Ward 15",
    "Ward 17",
    "Ward 19",
    "Ward 21",
    "Ward 22",
    "Ward 24",
    "Ward 25",
    "Ward 26",
    "Ward 27",
    "Ward 28",
  ],
  "District Gò Vấp": [
    "Ward 1",
    "Ward 3",
    "Ward 4",
    "Ward 5",
    "Ward 6",
    "Ward 7",
    "Ward 8",
    "Ward 9",
    "Ward 10",
    "Ward 11",
    "Ward 12",
    "Ward 13",
    "Ward 14",
    "Ward 15",
    "Ward 16",
    "Ward 17",
  ],
  "District Phú Nhuận": [
    "Ward 1",
    "Ward 2",
    "Ward 3",
    "Ward 4",
    "Ward 5",
    "Ward 7",
    "Ward 8",
    "Ward 9",
    "Ward 10",
    "Ward 11",
    "Ward 12",
    "Ward 13",
    "Ward 14",
    "Ward 15",
    "Ward 17",
  ],
  "District Tân Bình": [
    "Ward 1",
    "Ward 2",
    "Ward 3",
    "Ward 4",
    "Ward 5",
    "Ward 6",
    "Ward 7",
    "Ward 8",
    "Ward 9",
    "Ward 10",
    "Ward 11",
    "Ward 12",
    "Ward 13",
    "Ward 14",
    "Ward 15",
  ],
  "District Tân Phú": [
    "Ward Hiệp Tân",
    "Ward Hòa Thạnh",
    "Ward Phú Thạnh",
    "Ward Phú Thọ Hòa",
    "Ward Phú Trung",
    "Ward Sơn Kỳ",
    "Ward Tân Quý",
    "Ward Tân Sơn Nhì",
    "Ward Tân Thành",
    "Ward Tây Thạnh",
  ],
  "District Thủ Đức": [
    "Ward Bình Chiểu",
    "Ward Bình Thọ",
    "Ward Hiệp Bình Chánh",
    "Ward Hiệp Bình Phước",
    "Ward Linh Chiểu",
    "Ward Linh Đông",
    "Ward Linh Tây",
    "Ward Linh Trung",
    "Ward Linh Xuân",
    "Ward Tam Bình",
    "Ward Tam Phú",
    "Ward Trường Thọ",
  ],
  "District Bình Chánh": [
    "Commune An Phú Tây",
    "Commune Bình Chánh",
    "Commune Bình Hưng",
    "Commune Bình Lợi",
    "Commune Đa Phước",
    "Commune Hưng Long",
    "Commune Lê Minh Xuân",
    "Commune Phạm Văn Hai",
    "Commune Phong Phú",
    "Commune Quy Đức",
    "Commune Tân Kiên",
    "Commune Tân Nhựt",
    "Commune Tân Quý Tây",
    "Commune Vĩnh Lộc A",
    "Commune Vĩnh Lộc B",
  ],
  "District Cần Giờ": [
    "Commune An Thới Đông",
    "Commune Bình Khánh",
    "Commune Long Hòa",
    "Commune Lý Nhơn",
    "Commune Tam Thôn Hiệp",
    "Commune Thạnh An",
  ],
  "District Củ Chi": [
    "Commune An Nhơn Tây",
    "Commune An Phú",
    "Commune Bình Mỹ",
    "Commune Hòa Phú",
    "Commune Nhuận Đức",
    "Commune Phạm Văn Cội",
    "Commune Phú Hòa Đông",
    "Commune Phú Mỹ Hưng",
    "Commune Phước Hiệp",
    "Commune Phước Thạnh",
    "Commune Phước Vĩnh An",
    "Commune Tân An Hội",
    "Commune Tân Phú Trung",
    "Commune Tân Thạnh Đông",
    "Commune Tân Thạnh Tây",
    "Commune Tân Thông Hội",
    "Commune Thái Mỹ",
    "Commune Trung An",
    "Commune Trung Lập Hạ",
    "Commune Trung Lập Thượng",
  ],
  "District Hóc Môn": [
    "Commune Bà Điểm",
    "Commune Đông Thạnh",
    "Commune Nhị Bình",
    "Commune Tân Hiệp",
    "Commune Tân Thới Nhì",
    "Commune Thới Tam Thôn",
    "Commune Trung Chánh",
    "Commune Xuân Thới Đông",
    "Commune Xuân Thới Sơn",
    "Commune Xuân Thới Thượng",
  ],
  "District Nhà Bè": [
    "Commune Hiệp Phước",
    "Commune Long Thới",
    "Commune Nhơn Đức",
    "Commune Phú Xuân",
    "Commune Phước Kiển",
    "Commune Phước Lộc",
  ],
};

export const districtsHCM = [
  "District 1",
  "District 2",
  "District 3",
  "District 4",
  "District 5",
  "District 6",
  "District 7",
  "District 8",
  "District 9",
  "District 10",
  "District 11",
  "District 12",
  "District Bình Thạnh",
  "District Gò Vấp",
  "District Phú Nhuận",
  "District Tân Bình",
  "District Tân Phú",
  "District Thủ Đức",
  "District Bình Chánh",
  "District Cần Giờ",
  "District Củ Chi",
  "District Hóc Môn",
  "District Nhà Bè",
];

export const timeSlots = [
  { value: "08:00", label: "08:00 AM - 09:00 AM" },
  { value: "09:00", label: "09:00 AM - 10:00 AM" },
  { value: "10:00", label: "10:00 AM - 11:00 AM" },
  { value: "11:00", label: "11:00 AM - 12:00 AM" },
  { value: "12:00", label: "12:00 AM - 01:00 PM" },
  { value: "13:00", label: "01:00 PM - 02:00 PM" },
  { value: "14:00", label: "02:00 PM - 03:00 PM" },
  { value: "15:00", label: "03:00 PM - 04:00 PM" },
  { value: "16:00", label: "04:00 PM - 05:00 PM" },
  { value: "17:00", label: "05:00 PM - 06:00 PM" },
  { value: "18:00", label: "06:00 PM - 07:00 PM" },
];
// export const timeSlots = [
//   { value: "", label: "Select a time slot" },
//   { value: "06:00 - 07:00", label: "06:00 AM - 07:00 AM" },
//   { value: "07:00 - 08:00", label: "07:00 AM - 08:00 AM" },
//   { value: "08:00 - 09:00", label: "08:00 AM - 09:00 AM" },
//   { value: "09:00 - 10:00", label: "09:00 AM - 10:00 AM" },
//   { value: "10:00 - 11:00", label: "10:00 AM - 11:00 AM" },
//   { value: "11:00 - 12:00", label: "11:00 AM - 12:00 PM" },
//   { value: "12:00 - 01:00", label: "12:00 PM - 01:00 PM" },
//   { value: "01:00 - 02:00", label: "01:00 PM - 02:00 PM" },
//   { value: "02:00 - 03:00", label: "02:00 PM - 03:00 PM" },
//   { value: "03:00 - 04:00", label: "03:00 PM - 04:00 PM" },
//   { value: "04:00 - 05:00", label: "04:00 PM - 05:00 PM" },
//   { value: "05:00 - 06:00", label: "05:00 PM - 06:00 PM" },
//   { value: "06:00 - 07:00", label: "06:00 PM - 07:00 PM" },
//   { value: "07:00 - 08:00", label: "07:00 PM - 08:00 PM" },
//   { value: "08:00 - 09:00", label: "08:00 PM - 09:00 PM" },
// ];



