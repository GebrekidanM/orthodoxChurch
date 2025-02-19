export const handleAxiosError = (error) => {
    let errorMessage = "Something went wrong. Please try again.";
  
    if (error.response) {
      const status = error.response.status;
  
      if (status >= 500) {
        console.error("🚨 Server Error:", status, error.response.data);
        errorMessage = "Server is experiencing issues. Please try again later.";
      } else if (status >= 400) {
        console.warn("⚠️ Client Error:", status, error.response.data);
        errorMessage = error.response.data?.message || "Request failed. Please check your input.";
      }
    } else if (error.request) {
      console.error("❌ Network Error: No response from server", error.request);
      errorMessage = "Cannot connect to the server. Check your internet connection.";
    } else {
      console.error("❗ Unexpected Error:", error.message);
      errorMessage = "Unexpected error: " + error.message;
    }
  
    return errorMessage;
  };
  
  