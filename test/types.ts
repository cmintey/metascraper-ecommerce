export interface SiteTest {
    sitename: string;
    url: string;
    expectedData: ExpectedData;
}

export interface ExpectedData {
    name: string | null;
    price: string | null;
    currency: string | null;
    brand: string | null;
    image: string | null;
    retailer: string | null;
}
