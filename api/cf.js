import { createClient } from 'contentful';

const PAGE_TYPES = ['page', 'localizedPage'];

const isDev = process.env.NODE_ENV === 'development';

export async function getEntries(type, queryParams) {
    const client = createClient({
        accessToken: isDev ? process.env.CONTENTFUL_PREVIEW_TOKEN : process.env.CONTENTFUL_DELIVERY_TOKEN,
        space: process.env.CONTENTFUL_SPACE_ID,
        host: isDev ? 'preview.contentful.com' : 'cdn.contentful.com'
    });

    return client.getEntries({
        content_type: type,
        ...queryParams,
        include: 10,
    })
        .then((response) => response.items.map(mapEntry));
}

export async function getPage(slug) {
    return Promise.all(PAGE_TYPES.map(type=>getEntries(type, {
        'fields.slug': slug
    }))).then((results)=>{
        return results.flat();
    }).then((items) => {
        return items.length > 0 ? items[0] : null;
    });
}

export async function getAllPageSlugs() {
    return Promise.all(PAGE_TYPES.map(type=>getEntries(type))).then((results)=>{
        return results.flat();
    }).then((pages) => pages.map((page) => page.fields.slug));
}


function mapEntry(entry) {
    return {
        _id: entry.sys?.id,
        _type: entry.sys?.contentType?.sys.id || entry.sys?.type,
        fields: Object.entries(entry.fields).reduce((acc, [key, value]) => {

            acc[key] = parseField(value);
            return acc;
        }, {}),
    };
}

function parseField(value) {
    if (typeof value === 'object' && value.sys) {
        return mapEntry(value);
    }

    if (Array.isArray(value)) {
        return value.map(mapEntry);
    }

    return value;
}

