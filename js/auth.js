//cek confirm password
const getCookie = (name) => {
    var cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          return cookieValue;
        }
        return window.location.replace("/login");
      }
      return null;
    }
  }

const setCookie = (cname, cvalue, exdays) => {
    try {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        let expires = "expires=" + d.toUTCString();
        // document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    } catch (error) {
        console.error("Error setting cookie:", error);
    }
}
// setCookie("username", "John Doe", 30);

module.exports = {
    getCookie,
    setCookie
};