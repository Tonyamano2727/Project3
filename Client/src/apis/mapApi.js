import axios from "axios";

const API_KEY = "JgyBcd5fd6G1Cg3TEfjTx39IaqElsZDFLVO8jKP2";

/**
 * Lấy danh sách quận/huyện trong Hồ Chí Minh
 * @returns {Promise}
 */
export const fetchDistricts = async () => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/p/79?depth=2`
    );
    return response.data.districts;
  } catch (err) {
    console.error("Error fetching districts:", err);
    throw new Error("Failed to fetch districts.");
  }
};

/**
 * Lấy danh sách phường/xã trong một quận
 * @param {string} districtId - Mã quận
 * @returns {Promise}
 */
export const fetchWards = async (districtId) => {
  try {
    const response = await axios.get(
      `https://provinces.open-api.vn/api/d/${districtId}?depth=2`
    );
    return response.data.wards;
  } catch (err) {
    console.error("Error fetching wards:", err);
    throw new Error("Failed to fetch wards.");
  }
};

/**
 * Gợi ý địa chỉ 
 * @param {string} input - Địa chỉ cần gợi ý
 * @returns {Promise}
 */
export const fetchAddressSuggestions = async (input) => {
  try {
    const response = await axios.get(
      `https://rsapi.goong.io/Place/AutoComplete`,
      {
        params: {
          api_key: API_KEY,
          location: "10.77609,106.69508", 
          input,
        },
      }
    );
    return response.data.predictions;
  } catch (err) {
    console.error("Error fetching address suggestions:", err);
    throw new Error("Failed to fetch address suggestions.");
  }
};
