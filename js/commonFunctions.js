let urlParamsDict = {};

// Initializes the Materialize components.
const init = () => {
  $('.sidenav').sidenav();
  $(".dropdown-trigger").dropdown();

  let urlParams = window.location.search.substring(1).split('&');
  for (let index in urlParams) {
    let param = urlParams[index].split('=');
    urlParamsDict[param[0]] = (param[1] == undefined) ? true : decodeURIComponent(param[1]);
  }
}

const getUrlParameter = (paramName) => {
  if (urlParamsDict.hasOwnProperty(paramName))
    return urlParamsDict[paramName];
  return null;
}

export { init, getUrlParameter };