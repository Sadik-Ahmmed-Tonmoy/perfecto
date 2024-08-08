import React, {useEffect, useState} from "react";
import {Bars} from "react-loader-spinner";
import {ScrollRestoration, useLocation, useParams} from "react-router-dom";
import CardCarousel from "../../components/CardCarousel/CardCarousel";
import ImageURL from "../../components/ImageURL/ImageURL";
import CarouselCategoryCard from "../../components/allCards/CarouselCategoryCard/CarouselCategoryCard";
import CenterAlignCard from "../../components/allCards/CenterAlignCard/CenterAlignCard";
import ComboCard from "../../components/allCards/ComboCard/ComboCard";
import {useOfferProductsMutation} from "../../redux/features/offers/offersApi";
import ProductFilterPage from "../ProductFilterPage/ProductFilterPage";
import useCartData from "../../hooks/useCartData";
import HomeSkeleton from "../Home/HomeSkeleton/HomeSkeleton";
import CampaignGridView from "./CampaignGridView/CampaignGridView";
import SwiperSlider from "../../components/SwiperSlider/SwiperSlider";
import {SwiperSlide} from "swiper/react";

const Campaign = () => {
    const [isCategoryFilter, setIsCategoryFilter] = useState(false);
    const [offerProductsMutation, {data: offerProductListData, isLoading: offerProductListLoading}] = useOfferProductsMutation();
    const location = useLocation();
    const {id, campaignCategoryId} = useParams();
    const {cartData, cartIsLoading} = useCartData();

    const generateNewArray = () => {
        return offerProductListData?.data?.data.map((offerProduct) => {
            const isAlreadyAdded = cartData?.data.some((cartItem) => cartItem.id === offerProduct.product_id);
            return {
                ...offerProduct,
                alreadyAdded: isAlreadyAdded,
            };
        });
    };

    //

    useEffect(() => {
        const fetchOfferListData = async () => {
            const offerBodyData = {
                offer_id: id,
                pagination: 30,
            };

            try {
                const response = await offerProductsMutation(offerBodyData);
                //
            } catch (error) {
                console.error("Error fetching data:", error.message);
            }
        };
        fetchOfferListData();
    }, [id]);

    if (offerProductListLoading) {
        return (
            // <div className="flex justify-center items-center min-h-[calc(100vh-55vh)]">
            //     <Bars height="40" width="80" color="#5DC9F4" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true} />
            // </div>
            <HomeSkeleton/>
        );
    }

    return (
        <>
            <SwiperSlider/>
            {offerProductListData?.status == true &&
                (offerProductListData?.data?.offer_type_id == 1 ? (
                    <div>
                        <div className="my-3 container mx-auto px-[10px] ">
                            <ImageURL className={" w-full object-fill h-[120px] md:h-[220px]"} image={offerProductListData?.data?.banner_web}/>
                        </div>
                        <div className=" container mx-auto">
                            {/* <CardCarousel
                defaultSlidesToShow={offerProductListData?.data?.data?.length >= 5 ? 5 : offerProductListData?.data?.data?.length}
                slidesToShowFor540={offerProductListData?.data?.data?.length >= 1 ? 1 : offerProductListData?.data?.data?.length}
                slidesToShowFor640={offerProductListData?.data?.data?.length >= 2 ? 2 : offerProductListData?.data?.data?.length}
                slidesToShowFor768={offerProductListData?.data?.data?.length >= 3 ? 3 : offerProductListData?.data?.data?.length}
                slidesToShowFor1024={offerProductListData?.data?.data?.length >= 3 ? 3 : offerProductListData?.data?.data?.length}
                slidesToShowFor1280={offerProductListData?.data?.data?.length >= 4 ? 4 : offerProductListData?.data?.data?.length}
                slidesToShowFor1536={offerProductListData?.data?.data?.length >= 5 ? 5 : offerProductListData?.data?.data?.length}
              >
                {offerProductListData?.data?.data?.length > 0 &&
                  offerProductListData?.data?.data?.map((item, i) => (
                    <div key={i} className="min-w-min px-[10px]">
                      <CarouselCategoryCard item={item} />
                    </div>
                  ))}
              </CardCarousel> */}

                            <SwiperSlider>
                                {offerProductListData?.data?.data?.length > 0 &&
                                    offerProductListData?.data?.data?.map((item, i) => (

                                        <SwiperSlide key={i}>
                                            <CarouselCategoryCard item={item}/>
                                        </SwiperSlide>

                                    ))}
                            </SwiperSlider>
                        </div>
                        {campaignCategoryId == undefined ? (
                            <>
                                <div className="mb-4 md:mb-10 container mx-auto">
                                    {offerProductListData?.data?.data?.length > 0 &&
                                        offerProductListData?.data?.data?.map((items, i) => (
                                            <div key={i} className="mb-4 md:mb-10">
                                                <h4 className="text-[#000000CC] px-[10px] text-center font-inter text-[20px]  md:text-[32px] font-bold leading-normal mb-2 md:mb-4 font-serif">
                                                    {items?.name}
                                                </h4>
                                                {/* <CardCarousel
                          defaultSlidesToShow={items?.products?.data?.length >= 5 ? 5 : items?.products?.data?.length}
                          slidesToShowFor540={items?.products?.data?.length >= 1 ? 1 : items?.products?.data?.length}
                          slidesToShowFor640={items?.products?.data?.length >= 2 ? 2 : items?.products?.data?.length}
                          slidesToShowFor768={items?.products?.data?.length >= 3 ? 3 : items?.products?.data?.length}
                          slidesToShowFor1024={items?.products?.data?.length >= 3 ? 3 : items?.products?.data?.length}
                          slidesToShowFor1280={items?.products?.data?.length >= 4 ? 4 : items?.products?.data?.length}
                          slidesToShowFor1536={items?.products?.data?.length >= 5 ? 5 : items?.products?.data?.length}
                        >
                          {items?.products?.data?.map((item, i) => (
                            <div key={i} className="min-w-min px-[10px]">
                              <CenterAlignCard key={i} item={item} />
                            </div>
                          ))}
                        </CardCarousel> */}
                                                <SwiperSlider>
                                                    {items?.products?.data?.map((item, i) => (

                                                        <SwiperSlide key={i}>
                                                            <CenterAlignCard item={item}/>
                                                        </SwiperSlide>

                                                    ))}
                                                </SwiperSlider>
                                            </div>
                                        ))}
                                </div>
                            </>
                        ) : (
                            // <ProductFilterPage link={""} topArea={false} />
                            <CampaignGridView/>
                        )}
                        {/* ScrollRestoration start */}
                        {location?.search ? (
                            ""
                        ) : (
                            <div>
                                <ScrollRestoration/>
                            </div>
                        )}
                        {/* ScrollRestoration end */}
                        {/* <ScrollRestoration /> */}
                    </div>
                ) : offerProductListData?.data?.offer_type_id == 2 ? (
                        //only for combo start
                        <>
                            <div className="my-3 container mx-auto px-[10px] ">
                                <ImageURL className={" w-full object-fill h-[120px] md:h-[220px]"} image={offerProductListData?.data?.banner_web}/>
                            </div>
                            <div className=" container mx-auto px-[10px] mb-4 md:mb-10">
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 md:gap-5 min-h-[calc(100vh-90vh)]">
                                    {offerProductListData?.data?.data?.data?.map((item, i) => (
                                        <div key={i} className="min-w-min px-[10px]">
                                            <ComboCard item={item}/>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : //only for combo end
                    offerProductListData?.data?.offer_type_id == 3 ? (
                        <div>
                            <div className="my-3 container mx-auto px-[10px] ">
                                <ImageURL className={" w-full object-fill h-[120px] md:h-[220px]"} image={offerProductListData?.data?.banner_web}/>
                            </div>
                            <div className=" container mx-auto">
                                {/* <CardCarousel
                defaultSlidesToShow={offerProductListData?.data?.data?.length >= 5 ? 5 : offerProductListData?.data?.data?.length}
                slidesToShowFor540={offerProductListData?.data?.data?.length >= 1 ? 1 : offerProductListData?.data?.data?.length}
                slidesToShowFor640={offerProductListData?.data?.data?.length >= 2 ? 2 : offerProductListData?.data?.data?.length}
                slidesToShowFor768={offerProductListData?.data?.data?.length >= 3 ? 3 : offerProductListData?.data?.data?.length}
                slidesToShowFor1024={offerProductListData?.data?.data?.length >= 3 ? 3 : offerProductListData?.data?.data?.length}
                slidesToShowFor1280={offerProductListData?.data?.data?.length >= 4 ? 4 : offerProductListData?.data?.data?.length}
                slidesToShowFor1536={offerProductListData?.data?.data?.length >= 5 ? 5 : offerProductListData?.data?.data?.length}
              >
                {offerProductListData?.data?.data?.length > 0 &&
                  offerProductListData?.data?.data?.map((item, i) => (
                    <div key={i} className="min-w-min px-[10px]">
                      <CarouselCategoryCard item={item} />
                    </div>
                  ))}
              </CardCarousel> */}
                                <SwiperSlider>
                                    {offerProductListData?.data?.data?.length > 0 &&
                                        offerProductListData?.data?.data?.map((item, i) => (

                                            <SwiperSlide key={i}>
                                                <CarouselCategoryCard item={item}/>
                                            </SwiperSlide>

                                        ))}
                                </SwiperSlider>
                            </div>
                            {campaignCategoryId == undefined ? (
                                <>
                                    <div className="mb-4 md:mb-10 container mx-auto">
                                        {offerProductListData?.data?.data?.length > 0 &&
                                            offerProductListData?.data?.data?.map((items, i) => (
                                                <div key={i} className="mb-4 md:mb-10">
                                                    <h4 className="text-[#000000CC] px-[10px] text-center font-inter text-[20px]  md:text-[32px] font-bold leading-normal mb-2 md:mb-4 font-serif">
                                                        {items?.name}
                                                    </h4>
                                                    {/* <CardCarousel
                          defaultSlidesToShow={items?.products?.data?.length >= 5 ? 5 : items?.products?.data?.length}
                          slidesToShowFor540={items?.products?.data?.length >= 1 ? 1 : items?.products?.data?.length}
                          slidesToShowFor640={items?.products?.data?.length >= 2 ? 2 : items?.products?.data?.length}
                          slidesToShowFor768={items?.products?.data?.length >= 3 ? 3 : items?.products?.data?.length}
                          slidesToShowFor1024={items?.products?.data?.length >= 3 ? 3 : items?.products?.data?.length}
                          slidesToShowFor1280={items?.products?.data?.length >= 4 ? 4 : items?.products?.data?.length}
                          slidesToShowFor1536={items?.products?.data?.length >= 5 ? 5 : items?.products?.data?.length}
                        >
                          {items?.products?.data?.map((item, i) => (
                            <div key={i} className="min-w-min px-[10px]">
                              <CenterAlignCard key={i} item={item} />
                            </div>
                          ))}
                        </CardCarousel> */}
                                                    <SwiperSlider>
                                                        {items?.products?.data?.map((item, i) => (

                                                            <SwiperSlide key={i}>
                                                                <CenterAlignCard key={i} item={item}/>
                                                            </SwiperSlide>

                                                        ))}
                                                    </SwiperSlider>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                // <ProductFilterPage link={""} topArea={false} />
                                <CampaignGridView/>
                            )}
                            {/* ScrollRestoration start */}
                            {location?.search ? (
                                ""
                            ) : (
                                <div>
                                    <ScrollRestoration/>
                                </div>
                            )}
                            {/* ScrollRestoration end */}
                            {/* <ScrollRestoration /> */}
                        </div>
                    ) : offerProductListData?.data?.offer_type_id == 4 ? (
                        <div>
                            <div className="my-3 container mx-auto px-[10px] ">
                                <ImageURL className={" w-full object-fill h-[120px] md:h-[220px]"} image={offerProductListData?.data?.banner_web}/>
                            </div>
                            <div className=" container mx-auto">
                                {/* <CardCarousel
                defaultSlidesToShow={offerProductListData?.data?.data?.length >= 5 ? 5 : offerProductListData?.data?.data?.length}
                slidesToShowFor540={offerProductListData?.data?.data?.length >= 1 ? 1 : offerProductListData?.data?.data?.length}
                slidesToShowFor640={offerProductListData?.data?.data?.length >= 2 ? 2 : offerProductListData?.data?.data?.length}
                slidesToShowFor768={offerProductListData?.data?.data?.length >= 3 ? 3 : offerProductListData?.data?.data?.length}
                slidesToShowFor1024={offerProductListData?.data?.data?.length >= 3 ? 3 : offerProductListData?.data?.data?.length}
                slidesToShowFor1280={offerProductListData?.data?.data?.length >= 4 ? 4 : offerProductListData?.data?.data?.length}
                slidesToShowFor1536={offerProductListData?.data?.data?.length >= 5 ? 5 : offerProductListData?.data?.data?.length}
              >
                {offerProductListData?.data?.data?.length > 0 &&
                  offerProductListData?.data?.data?.map((item, i) => (
                    <div key={i} className="min-w-min px-[10px]">
                      <CarouselCategoryCard item={item} />
                    </div>
                  ))}
              </CardCarousel> */}
                                <SwiperSlider>
                                    {offerProductListData?.data?.data?.length > 0 &&
                                        offerProductListData?.data?.data?.map((item, i) => (

                                            <SwiperSlide key={i}>
                                                <CarouselCategoryCard item={item}/>
                                            </SwiperSlide>

                                        ))}
                                </SwiperSlider>
                            </div>
                            {campaignCategoryId == undefined ? (
                                <>
                                    <div className="mb-4 md:mb-10 container mx-auto">
                                        {offerProductListData?.data?.data?.length > 0 &&
                                            offerProductListData?.data?.data?.map((items, i) => (
                                                <div key={i} className="mb-4 md:mb-10">
                                                    <h4 className="text-[#000000CC] px-[10px] text-center font-inter text-[20px]  md:text-[32px] font-bold leading-normal mb-2 md:mb-4 font-serif">
                                                        {items?.name}
                                                    </h4>
                                                    {/* <CardCarousel
                          defaultSlidesToShow={items?.products?.data?.length >= 5 ? 5 : items?.products?.data?.length}
                          slidesToShowFor540={items?.products?.data?.length >= 1 ? 1 : items?.products?.data?.length}
                          slidesToShowFor640={items?.products?.data?.length >= 2 ? 2 : items?.products?.data?.length}
                          slidesToShowFor768={items?.products?.data?.length >= 3 ? 3 : items?.products?.data?.length}
                          slidesToShowFor1024={items?.products?.data?.length >= 3 ? 3 : items?.products?.data?.length}
                          slidesToShowFor1280={items?.products?.data?.length >= 4 ? 4 : items?.products?.data?.length}
                          slidesToShowFor1536={items?.products?.data?.length >= 5 ? 5 : items?.products?.data?.length}
                        >
                          {items?.products?.data?.map((item, i) => (
                            <div key={i} className="min-w-min px-[10px]">
                              <CenterAlignCard key={i} item={item} />
                            </div>
                          ))}
                        </CardCarousel> */}
                                                    <SwiperSlider>
                                                        {items?.products?.data?.map((item, i) => (

                                                            <SwiperSlide key={i}>
                                                                <CenterAlignCard key={i} item={item}/>
                                                            </SwiperSlide>

                                                        ))}
                                                    </SwiperSlider>
                                                </div>
                                            ))}
                                    </div>
                                </>
                            ) : (
                                // <ProductFilterPage link={""} topArea={false} />
                                <CampaignGridView/>
                            )}
                            {/* ScrollRestoration start */}
                            {location?.search ? (
                                ""
                            ) : (
                                <div>
                                    <ScrollRestoration/>
                                </div>
                            )}
                            {/* ScrollRestoration end */}
                            {/* <ScrollRestoration /> */}
                        </div>
                    ) : (
                        ""
                    ))}
        </>
    );
};

export default Campaign;
