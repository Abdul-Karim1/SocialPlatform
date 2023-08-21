import Axios from 'axios';
export const sendOtp = async (email) => {
    try {
        
      const response = await Axios.post('http://localhost:5000/users/emailsend', {
        email: email
      });
  
      const record = response.data;
      if (record.statusText === 'Success') {
        return record.message; // Return the message for success
      } else {
        throw new Error(record.message); // Throw an error for failure
      }
    } catch (error) {
      throw new Error("Something went wrong! User does not exist.");
    }
  };