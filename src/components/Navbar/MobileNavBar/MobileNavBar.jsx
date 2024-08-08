import {Drawer, Spin} from "antd";
import {useContext, useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {AiOutlineHeart} from "react-icons/ai";
import {BiSearchAlt2} from "react-icons/bi";
import {BsPerson} from "react-icons/bs";
import {FaArrowLeftLong} from "react-icons/fa6";
import {HiOutlineMenuAlt1} from "react-icons/hi";
import {IoClose} from "react-icons/io5";
import {MdOpenInNew, MdOutlineShoppingBag} from "react-icons/md";
import {Link, useNavigate} from "react-router-dom";
import logo from "../../../assets/logo/logo.png";
import useAuthUser from "../../../hooks/useAuthUser";
import {LogicProviderContext} from "../../../providers/LogicProvider";
import {useCategoryListQuery} from "../../../redux/features/categoryList/categoryListApi";
import {useOffersQuery} from "../../../redux/features/offers/offersApi";
import {useGetWishListQuery} from "../../../redux/features/wishList/wishListApi";
import {filterAndSortCategories} from "../../../utilities/filterAndSortCategories";
import MultiLayerMenu from "../../MultiLayerMenu/MultiLayerMenu";
import Button from "../../ui/Button";
import "./MobileNavBar.scss";
import useCartData from "../../../hooks/useCartData";
import {useSearchNameListMutation, useTrendingSearchMutation} from "../../../redux/features/productFilter/productFilterApi";
import {LoadingOutlined} from "@ant-design/icons";
import {Bars} from "react-loader-spinner";
import ImageURL from "../../ImageURL/ImageURL";

const MobileNavBar = () => {
    const navigate = useNavigate();
    const [trendingPagination, setTrendingPagination] = useState(5);
    const [trendingList, setTrendingList] = useState([]);
    const [searchNameList, setSearchNameList] = useState([]);
    const [categoryListArr, setCategoryListArr] = useState([]);
    const [brandListArr, setBrandListArr] = useState([]);

    const {data: wishListItems} = useGetWishListQuery();
    const {
        open,
        setOpen,
        wishListDrawerOpen,
        setWishListDrawerOpen,
        mobileTrendingRef,
        mobileShowTrendingSearch,
        setMobileShowTrendingSearch,
        mobileNavbarRelatedSearchRef,
        showSearchNameList,
        setShowSearchNameList
    } = useContext(LogicProviderContext);
    const [menuOpen, setMenuOpen] = useState(false);
    const [trendingSearchMutation, {data: trendingSearchData, isLoading: trendingSearchIsLoading}] = useTrendingSearchMutation();
    const [searchNameListMutation, {data: searchNameListData, isLoading: searchNameListIsLoading}] = useSearchNameListMutation();
    const {userData} = useAuthUser();
    // const { data: userData, error, isLoading } = useUserDataQuery();
    const {data: offerButtons} = useOffersQuery();
    const onClose = () => {
        setMenuOpen(false);
    };
    const {register, handleSubmit, setValue, watch} = useForm();
    const onSubmit = (data) => {
        navigate(`/product-filter?search-value=${data?.search}`);
    };

    const {data: categoryList} = useCategoryListQuery();
    const {cartData, cartIsLoading} = useCartData();
    const filteredAndSortedCategories = filterAndSortCategories(categoryList?.data);
    const handleFocus = () => {
        setMobileShowTrendingSearch(true);
    };
    const searchInput = watch("search");

    useEffect(() => {
        if (searchInput?.length > 0) {
            setShowSearchNameList(true);
            setMobileShowTrendingSearch(false);
            setTrendingPagination(1);
        } else {
            setTrendingPagination(5);
            setShowSearchNameList(false);
        }
    }, [searchInput]);

    useEffect(() => {
        const fetchData = async () => {
            if (mobileShowTrendingSearch) {
                const trendingSearchInput = {
                    pagination: trendingPagination,
                    // keyword: searchInput,
                };
                try {
                    const response = await trendingSearchMutation(trendingSearchInput);
                    setTrendingList(response?.data?.data?.data);
                    // Do something with the response if needed
                } catch (error) {
                    console.error("Error fetching data:", error.message);
                }
            }
        };

        fetchData(); // Call the async function immediately
    }, [mobileShowTrendingSearch, trendingSearchMutation]);

    useEffect(() => {
        const fetchData = async () => {
            if (showSearchNameList) {
                const listOfSearchInput = {
                    pagination: 5,
                    search: searchInput,
                };
                try {
                    const response = await searchNameListMutation(listOfSearchInput);
                    setSearchNameList(response?.data?.data?.products?.data);
                    setCategoryListArr(response?.data?.data?.categories?.data);
                    setBrandListArr(response?.data?.data?.brands?.data);
                    // Do something with the response if needed
                } catch (error) {
                    console.error("Error fetching data:", error.message);
                }
            }
        };

        fetchData(); // Call the async function immediately
    }, [showSearchNameList, searchInput, searchNameListMutation]);


    return (
        <div className="mobile-navbar pt-2 pb-3 px-2">
            <div className="first-row">
                <div className="" onClick={() => setMenuOpen(true)}>
                    <HiOutlineMenuAlt1 size={20}/>
                </div>
                <Drawer
                    // title="Basic Drawer"
                    placement="left"
                    width="90%"
                    closable={false}
                    onClose={onClose}
                    open={menuOpen}
                    closeIcon={<FaArrowLeftLong style={{fontSize: "24px", color: "black"}}/>}
                    // extra={
                    //   <Space>
                    //     <Button onClick={onClose}>Cancel</Button>
                    //     <Button type="primary" onClick={onClose}>
                    //       OK
                    //     </Button>
                    //   </Space>
                    // }
                >
                    <div>
                        {/* drawer header start */}
                        <div className="flex items-center justify-between border-b-[1px] px-2 py-3">
                            <div className="h-5 w-28">
                                <img src={logo} className="max-h-full w-full object-cover" alt=""/>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    onClick={() => {
                                        setMenuOpen(false);
                                        setWishListDrawerOpen(true);
                                    }}
                                    variant="ghost"
                                    className="relative"
                                >
                                    <AiOutlineHeart className="w-6 h-6 text-[#000000]"/>
                                    {wishListItems?.data?.length > 0 && (
                                        <p className="absolute -right-2 -top-[8px] text-[10px] rounded-full bg-primary-color h-[18px] w-[18px] text-white flex items-center justify-center">{wishListItems?.data?.length}</p>
                                    )}
                                </Button>
                                <div onClick={onClose}>
                                    <IoClose size={25}/>
                                </div>
                            </div>
                        </div>
                        {/* drawer header end */}
                        {/* drawer body start */}
                        {/* account start */}
                        {userData?.status === true ? (
                            <div className="mx-auto my-2">
                                <Link to={"/my-account/my-profile"}>
                                    <div onClick={onClose} className="mx-auto rounded-full border border-black p-1 w-min h-min">
                                        <BsPerson className="font-semibold text-black " size={18}/>
                                    </div>
                                    <p className="text-center text-black -mt- text-xs">Profile</p>
                                </Link>
                            </div>
                        ) : (
                            <div className="mx-auto my-2">
                                <div onClick={onClose} className="mx-auto rounded-full border border-black p-1 w-min h-min">
                                    <Link to={"/login-with-email"}>
                                        <BsPerson className="font-semibold text-black " size={18}/>
                                    </Link>
                                </div>
                                <p className="text-center text-black -mt- text-xs">Login</p>
                            </div>
                        )}
                        <div className="flex flex-col justify-start items-start px-2 py-3">
                            <div className="mb-3 flex flex-col justify-start items-start gap-1">
                                {offerButtons?.status == true &&
                                    Array.isArray(offerButtons?.data) &&
                                    offerButtons?.data?.map((item, i) => (
                                        <Link key={i} to={`/campaign/${item?.offer?.id}`}>
                                            <button
                                                className={`text-base font-semibold`}
                                                onClick={onClose}
                                                style={{
                                                    color: item?.offer?.color,
                                                }}
                                            >
                                                {item?.offer?.name}
                                            </button>
                                        </Link>
                                    ))}
                            </div>
                            <div onClick={onClose} className="border-t-[1px]  w-full py-3 text-base font-semibold">
                                <Link to={"/brand-page-for-mobile"}>
                                    <p>Brands</p>
                                </Link>
                            </div>
                            <div className="border-t-[1px]  w-full py-3 text-base font-semibold">
                                Category
                                <MultiLayerMenu menuData={filteredAndSortedCategories} onClose={onClose}/>
                            </div>
                            <div onClick={onClose} className="border-t-[1px]  w-full py-3 text-base font-semibold">
                                <Link to={"/terms-and-condition"}>
                                    <span>Terms & Conditions</span>
                                </Link>
                            </div>
                            <div onClick={onClose} className="border-t-[1px]  w-full py-3 text-base font-semibold">
                                <Link to={"/my-account/return-and-cancel"}>
                                    <span>Return & Refund Policy</span>
                                </Link>
                            </div>
                        </div>
                        {/* drawer body end */}
                    </div>
                </Drawer>
                <div className="h-8 w-44">
                    <Link to={"/"}>
                        <img src={logo} className="max-h-full w-full object-cover" alt=""/>
                    </Link>
                </div>
                <div className="relative" onClick={() => setOpen(true)}>
                    <MdOutlineShoppingBag size={20}/>
                    {cartData?.data?.cartData?.length > 0 && (
                        <p className="absolute -right-[6px] text-[10px] -top-[8px] rounded-full bg-primary-color h-[18px] w-[18px] text-white flex items-center justify-center">{cartData?.data?.cartData?.length}</p>
                    )}
                </div>
            </div>
            <div className="second-row">
                {/* <form className="search-form" onSubmit={handleSubmit(onSubmit)}>
                    <input type="text" {...register("search")} placeholder="Search for products..." className="input" />
                    <button type="submit">
                        <BiSearchAlt2 className="" size={20} />
                    </button>
                </form> */}


                <div ref={mobileTrendingRef} className="search-form w-full">
                    <div ref={mobileNavbarRelatedSearchRef}>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <input
                                // onFocus={()=>setMobileShowTrendingSearch(true)}
                                type="text"
                                onFocus={handleFocus}
                                // onBlur={handleBlur}
                                {...register("search")}
                                // autoComplete="false"
                                autoComplete="off"
                                placeholder="Search for products..."
                                className="input text-black w-full"
                            />
                            {searchNameListIsLoading && (
                                <span className="absolute top-1 right-3">
                                            <Spin indicator={<LoadingOutlined style={{fontSize: 15}}/>}></Spin>
                                        </span>
                            )}
                            <button className="" type="submit">
                                <BiSearchAlt2 className="text-[#00000099]" size={20}/>
                            </button>
                        </form>
                        {trendingPagination !== 1 && (
                            <>
                                {" "}
                                {mobileShowTrendingSearch && (
                                    <div style={{boxShadow: "0px 0px 8px 0px rgba(228, 237, 240, 0.65)"}} className="absolute top-9 bg-white w-full shadow-md">
                                        <div className="w-full flex justify-between items-center">
                                            <p className="px-2 pt-2 font-bold">Trending Searches</p>
                                            <IoClose size={28} className="hover:scale-110 pt-2 pe-2 text-black cursor-pointer" onClick={() => setMobileShowTrendingSearch(false)}/>
                                        </div>
                                        <>
                                            {trendingList?.length < 1 ? (
                                                <div className="flex justify-center items-center h-20">
                                                    <Bars height="40" width="80" color="#5DC9F4" ariaLabel="bars-loading" wrapperStyle={{}} wrapperClass="" visible={true}/>
                                                </div>
                                            ) : (
                                                <>
                                                    {" "}
                                                    {trendingList.map((item, i) => (
                                                        <p key={i} className="ps-4 py-1 hover:cursor-pointer" onClick={() => setValue("search", item?.keyword)}>
                                                            {item?.keyword}
                                                        </p>
                                                    ))}
                                                </>
                                            )}
                                        </>
                                    </div>
                                )}
                            </>
                        )}

                        {showSearchNameList && (
                            <div style={{boxShadow: "0px 0px 8px 0px rgba(228, 237, 240, 0.65)"}}
                                 className={`max-h-[calc(100vh-40vh)] absolute overflow-hidden overflow-y-auto slim-scroll top-9 bg-white w-full shadow-md`}>
                                {searchNameList?.length > 0 && (
                                    <>
                                        <p className="px-2 py-2 font-bold">Products</p>
                                        {searchNameList?.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <Link to={`/product-filter?search-value=${item?.name}`}>
                                                    <div className="flex items-start gap-2 ms-2 mb-1 hover:text-primary-color">
                                                        <ImageURL image={item?.image} className={"h-10 w-10 rounded overflow-hidden border"}/>
                                                        <p
                                                            onClick={() => {
                                                                setShowSearchNameList(false);
                                                                setMobileShowTrendingSearch(false);
                                                                setValue("search", item?.name);
                                                            }}
                                                            className="ps-1 py-1 hover:cursor-pointer"
                                                        >
                                                            {item?.name}
                                                        </p>
                                                    </div>
                                                </Link>
                                                <MdOpenInNew size={23} className="pt-2 pe-2 cursor-pointer" onClick={() => setValue("search", item?.name)}/>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {categoryListArr?.length > 0 && (
                                    <>
                                        <p className="px-2 pt-2 font-bold">Category</p>
                                        {categoryListArr?.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <Link to={`/product-filter?category=${item?.id}`}>
                                                    <p
                                                        onClick={() => {
                                                            setShowSearchNameList(false);
                                                            setMobileShowTrendingSearch(false);
                                                            setValue("search", item?.name);
                                                        }}
                                                        className="ps-4 py-1 hover:cursor-pointer hover:text-primary-color"
                                                    >
                                                        {item?.name}
                                                    </p>
                                                </Link>
                                                <MdOpenInNew size={23} className="pt-2 pe-2 cursor-pointer" onClick={() => setValue("search", item?.name)}/>
                                            </div>
                                        ))}
                                    </>
                                )}
                                {brandListArr?.length > 0 && (
                                    <>
                                        <p className="px-2 pt-2 font-bold">Brand</p>
                                        {brandListArr?.map((item, i) => (
                                            <div key={i} className="flex justify-between items-center">
                                                <Link to={`/product-filter?brand=${item?.id}`}>
                                                    <p
                                                        onClick={() => {
                                                            setShowSearchNameList(false);
                                                            setMobileShowTrendingSearch(false);
                                                            setValue("search", item?.name);
                                                        }}
                                                        className="ps-4 py-1 hover:cursor-pointer hover:text-primary-color"
                                                    >
                                                        {item?.name}
                                                    </p>
                                                </Link>
                                                <MdOpenInNew size={23} className="pt-2 pe-2 cursor-pointer" onClick={() => setValue("search", item?.name)}/>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div>


            </div>
        </div>
    );
};

export default MobileNavBar;
