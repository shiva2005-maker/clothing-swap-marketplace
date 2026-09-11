import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white">

            {/*  HERO  */}

            <section className="bg-black text-white">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10 py-20 sm:py-24 lg:py-32">

                    <div className="max-w-3xl">

                        <p className="text-sm sm:text-base text-gray-400 font-medium mb-5">
                            CLOTHING EXCHANGE & SWAP MARKETPLACE
                        </p>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                            Exchange Clothes.
                            <br />
                            Refresh Your Style.
                        </h1>

                        <p className="text-gray-400 text-base sm:text-lg lg:text-xl mt-6 max-w-2xl leading-relaxed">
                            Give your unused clothes a second life.
                            Discover unique pieces, connect with people,
                            and swap clothes without spending money.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mt-9">

                            <button
                                onClick={() => navigate("/marketplace")}
                                className="bg-white text-black px-7 py-3.5 rounded-lg font-semibold hover:bg-gray-200 transition"
                            >
                                Explore Marketplace
                            </button>

                            <button
                                onClick={() => navigate("/add-clothing")}
                                className="border border-gray-600 text-white px-7 py-3.5 rounded-lg font-semibold hover:bg-white hover:text-black transition"
                            >
                                List an Item
                            </button>

                        </div>

                    </div>

                </div>

            </section>



            <section className="bg-gray-50 py-16 sm:py-20">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

                    <div className="text-center mb-12">

                        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                            Simple Process
                        </p>

                        <h2 className="text-3xl sm:text-4xl font-bold text-black mt-2">
                            How It Works
                        </h2>

                        <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                            Swap your clothes in three simple steps.
                        </p>

                    </div>


                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">

                        {/* Step 1 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-7">

                            <span className="text-sm font-bold text-gray-400">
                                01
                            </span>

                            <h3 className="text-xl font-bold mt-4">
                                Browse
                            </h3>

                            <p className="text-gray-500 mt-3 leading-relaxed">
                                Explore clothing items listed by other
                                members and find something you love.
                            </p>

                        </div>


                        {/* Step 2 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-7">

                            <span className="text-sm font-bold text-gray-400">
                                02
                            </span>

                            <h3 className="text-xl font-bold mt-4">
                                Send a Swap Request
                            </h3>

                            <p className="text-gray-500 mt-3 leading-relaxed">
                                Choose one of your own clothing items
                                and send an exchange request.
                            </p>

                        </div>


                        {/* Step 3 */}
                        <div className="bg-white rounded-2xl border border-gray-200 p-7">

                            <span className="text-sm font-bold text-gray-400">
                                03
                            </span>

                            <h3 className="text-xl font-bold mt-4">
                                Complete the Swap
                            </h3>

                            <p className="text-gray-500 mt-3 leading-relaxed">
                                Chat with the other member, agree on
                                the exchange and complete your swap.
                            </p>

                        </div>

                    </div>

                </div>

            </section>



            <section className="py-16 sm:py-20">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                        <div>

                            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                                Why SwapWear?
                            </p>

                            <h2 className="text-3xl sm:text-4xl font-bold mt-3">
                                Fashion that keeps moving.
                            </h2>

                            <p className="text-gray-500 mt-5 leading-relaxed max-w-xl">
                                Instead of letting clothes sit unused,
                                give them another journey. SwapWear
                                makes it easy to discover, exchange and
                                reuse clothing within a community.
                            </p>

                        </div>


                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="font-bold text-lg">
                                    Sustainable
                                </h3>

                                <p className="text-gray-500 text-sm mt-2">
                                    Extend the life of clothes and reduce waste.
                                </p>
                            </div>


                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="font-bold text-lg">
                                    No Money Required
                                </h3>

                                <p className="text-gray-500 text-sm mt-2">
                                    Exchange clothes directly instead of buying.
                                </p>
                            </div>


                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="font-bold text-lg">
                                    Easy Swapping
                                </h3>

                                <p className="text-gray-500 text-sm mt-2">
                                    Find an item and send a swap request easily.
                                </p>
                            </div>


                            <div className="border border-gray-200 rounded-xl p-6">
                                <h3 className="font-bold text-lg">
                                    Community
                                </h3>

                                <p className="text-gray-500 text-sm mt-2">
                                    Connect with people who want to exchange.
                                </p>
                            </div>

                        </div>

                    </div>

                </div>

            </section>



            <section className="bg-gray-100 py-16 sm:py-20">

                <div className="max-w-4xl mx-auto px-5 text-center">

                    <h2 className="text-3xl sm:text-4xl font-bold">
                        Ready to swap your clothes?
                    </h2>

                    <p className="text-gray-500 mt-4 max-w-xl mx-auto">
                        Discover something new or give your unused
                        clothes a new home.
                    </p>

                    <button
                        onClick={() => navigate("/marketplace")}
                        className="mt-7 bg-black text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-800 transition"
                    >
                        Explore Clothes
                    </button>

                </div>

            </section>


            {/*  FOOTER  */}

            <footer className="bg-black text-white py-8">

                <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-10">

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

                        <h3 className="font-bold text-lg">
                            SwapWear
                        </h3>

                        <p className="text-gray-500 text-sm text-center">
                            Clothing Exchange & Swap Marketplace
                        </p>

                        <p className="text-gray-600 text-xs">
                            © 2026 SwapWear
                        </p>

                    </div>

                </div>

            </footer>

        </div>
    );
};

export default Home;