const defaultPageSize = 10;
const defaultPage = 1;

export const pagination = (page, pageSize) => {
    const pageNumber = page || defaultPage;
    const pageLimit = pageSize || defaultPageSize;
    console.log('pageNumber '+pageNumber);
    return {
        limit: pageLimit,
        offset: (pageNumber - 1) * pageLimit
    }
}

export default pagination;