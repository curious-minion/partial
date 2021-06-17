import ApiService from './apiService';
import getEvents from './get-events';
import paginationTpl from '../templates/pagination.hbs';


const apiService = new ApiService();


export default async function getPages() {

  try {
    const result = await apiService.fetchEvents();
      const page = result.page;
      const currentPage = page.number + 1;
      const totalPages = page.totalPages;
    
      const range = pagination(currentPage, totalPages);
      loadList(currentPage, totalPages);
      check(currentPage, totalPages);
      
    
    // const string = range.toString();
    // return string;

    console.log(range);
    // renderPagesList(range);
    // console.log(paginationTpl(string));
    console.log(renderPagesList(currentPage));
    
    } catch (error) {
    console.log(error);
  }
}


const string = getPages();
console.log(string);
const numberPerPage = 20;
const pagingBox = document.querySelector('.pagination');
const pageNumber = document.querySelector('.page-number');
const decrementBtn = document.querySelector('[data-action="decrement"]');
const incrementBtn = document.querySelector('[data-action="increment"]');

// эта часть кода отвечает за отображение галереи с картинками

decrementBtn.addEventListener('click', previousPage);

incrementBtn.addEventListener('click', nextPage);

function nextPage() {
    pageNumber = pageNumber.nextElementSibling;
  renderPaginationList();
}

function previousPage() {
    pageNumber = pageNumber.previousElementSibling;
  renderPaginationList();
}

function renderPaginationList() { 
    pageNumber.classList.toggle('active-page');
    loadList();
}

function loadList(currentPage, totalPages) {
    let pageList = [];
    const begin = (currentPage - 1) * numberPerPage;
    const end = begin + numberPerPage;

    pageList = totalPages.toString().slice(begin, end);
    getEvents();
    renderPagesList();
    check();
}

function check(currentPage, totalPages) {
    incrementBtn.disabled = currentPage === totalPages ? true : false;
    decrementBtn.disabled = currentPage  === 0 ? true : false;
}

// function load() {
//     loadList();
// }
    
window.onload = getEvents();

function renderPagesList(string) {
    pagingBox.insertAdjacentHTML('afterbegin', paginationTpl(string));
}
console.log(renderPagesList());

// эта часть кода для навигации по страницам

function getRange(start, end) {
    return [...Array(end - start + 1).keys()].map(i => i + start);
}

function pagination(currentPage, totalPages) {
  let delta = 2;
  if (totalPages <= 7) {
    // delta === 7: [1 2 3 4 5 6 7]
    delta = 7;
  } else {
    // delta === 2: [1 ... 4 5 6 ... 10]
    // delta === 4: [1 2 3 4 5 ... 10]
    delta = currentPage > 4 && currentPage < totalPages - 3 ? 2 : 4
  }

  const range = {
    start: Math.round(currentPage - delta / 2),
    end: Math.round(currentPage + delta / 2),
  }

  if (range.start - 1 === 1 || range.end + 1 === totalPages) {
    range.start += 1;
    range.end += 1;
  }

  let pages = currentPage > delta
      ? getRange(Math.min(range.start, totalPages - delta), Math.min(range.end, totalPages))
      : getRange(1, Math.min(totalPages, delta + 1))

  const withDots = (value, pair) => (pages.length + 1 !== totalPages ? pair : [value])

  if (pages[0] !== 1) {
    pages = withDots(1, [1, '...']).concat(pages)
  }

  if (pages[pages.length - 1] < totalPages) {
    pages = pages.concat(withDots(totalPages, ['...', totalPages]))
  }

  return pages;
}

// потестить можно тут https://playcode.io/new/
console.log(pagination(24,25));
