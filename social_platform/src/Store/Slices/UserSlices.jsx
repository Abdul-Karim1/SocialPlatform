import { createSlice } from "@reduxjs/toolkit";
const userSlice = createSlice({
  name: "userSlice",
  initialState: {
    user: null, // Initialize with null or default user data
  },
  reducers: {
    resetUser: (state) => {
      state.user = null; // Reset the user data by setting it to null
      localStorage.removeItem("key");
    },
    addUser(state, action) {
      state.user = action.payload;
      console.log("PAYLOAD DATA", action.payload);
    },

    updateUser(state, action) {
      const data = action.payload.data;
      console.log("PAYLOAD EDIT-------------------->", data);

      // Create a new copy of the user object with updated properties
      const updatedUser = {
        ...state.user,
        name: data.name,
        interest: data.interest,
        picture: data.picture,
      };

      // Return a new state object with the updated user
      return {
        ...state,
        user: updatedUser,
      };
    },
  },
});
console.log(userSlice.actions);

export default userSlice.reducer;

export const { addUser } = userSlice.actions;
export const { updateUser } = userSlice.actions;
export const { resetUser } = userSlice.actions;
