import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js' 

export const deliveryOptions = [{
    id:'1',
    deliveryDays: 7,
    priceCents: 0
},{
    id:'2',
    deliveryDays: 3,
    priceCents:499
},{
    id: '3',
    deliveryDays: 1,
    priceCents: 999
}];

export function getDeliveryOption(deliveryOptionId){
    let deliveryOption

    deliveryOptions.forEach(option=>{
        if (option.id === deliveryOptionId){
            deliveryOption = option;
        }
    })
    return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOption){
    let today = dayjs();
    let deliveryDate = deliveryOption.deliveryDays
    let dateString = '';
    let daysAdded = 0;

    while (daysAdded < deliveryDate){
        today = today.add(1, 'day');
        if (today.day() !== 0 && today.day() !== 6){
            daysAdded++;
        }
    }
    dateString = today.format('dddd, MMMM D')

    return dateString;
}