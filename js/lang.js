function _(name)
{
	return chrome.i18n.getMessage(name)
}
function l(name)
{
	document.write(_(name));
}