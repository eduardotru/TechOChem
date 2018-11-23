let urlParamsDict = {};

/**
 * Initializes Materialize components and fills up a dictionary to store the names and values of
 * the GET parameters.
 */
const init = () => {
  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();

  let urlParams = window.location.search.substring(1).split('&');
  for (let index in urlParams) {
    let param = urlParams[index].split('=');
    urlParamsDict[param[0]] = (param[1] == undefined) ? true : decodeURIComponent(param[1]);
  }
}

/**
 * Gets the value of a specific parameter passed as part of the URL (GET parameter).
 * @param {string} paramName Name of the URL parameter whose value is to be returned.
 * @returns {string} Value of the URL parameter. Null if the parameter does not exist in the URL. 
 */
const getUrlParameter = (paramName) => {
  if (urlParamsDict.hasOwnProperty(paramName))
    return urlParamsDict[paramName];
  return null;
}

export { init, getUrlParameter };