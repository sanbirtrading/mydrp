// Show-Hide Sidebar feature

let showSideBar = false;
const sideBar = document.querySelector('.vertical-menu');

function sideBarControl(){
    const mobileView = window.innerWidth < 993 ? true : false;
    console.log('Sidebar control');
    if (mobileView){
        if (!showSideBar){
            sideBar.style.display = 'inline-block';
            showSideBar = true;
        } else {
            sideBar.style.display = 'none';
            showSideBar = false;
        }
    }
}