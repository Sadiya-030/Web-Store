"use client";

import { useSession } from "@/lib/auth/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Package,
  Heart,
  MapPin,
  Gem,
  LogOut,
  Loader2,
} from "lucide-react";
import { signOut } from "@/lib/auth/client";
import { useAuthStore } from "@/lib/stores/authStore";
import Link from "next/link";

/**
 * Account Dashboard Page
 * Protected route - redirects to auth if not authenticated
 * Desktop: Two-column layout with sidebar
 * Mobile: Tabs at top
 */
export default function AccountDashboard() {
  const session = useSession();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [activeTab, setActiveTab] = useState("profile");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [isTestLogin, setIsTestLogin] = useState(false);
  const [testUserEmail, setTestUserEmail] = useState("");

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const testFlag = localStorage.getItem("isTestLogin");
    const testEmail = localStorage.getItem("testUserEmail");

    if (testFlag && testEmail) {
      setIsTestLogin(true);
      setTestUserEmail(testEmail);
    }
  }, []);

  useEffect(() => {
    if (!session.isPending && !session.data?.user && !isTestLogin) {
      router.push("/");
    }
  }, [session.data?.user, session.isPending, router, isTestLogin]);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (err) {
      console.error("Sign Out API Call Failed, Clearing Local Session:", err);
    } finally {
      localStorage.removeItem("isTestLogin");
      localStorage.removeItem("testUserEmail");
      setIsTestLogin(false);
      setTestUserEmail("");
      router.push("/");
    }
  };

  // Create mock user for test login
  const displayUser =
    user ||
    (isTestLogin && testUserEmail
      ? {
          name: testUserEmail.split("@")[0],
          email: testUserEmail,
          id: "test-user",
        }
      : null);

  if (session.isPending || (!user && !isTestLogin)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-evol-red" size={40} />
      </div>
    );
  }

  const userInitials =
    displayUser?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase() || "U";

  const navItems = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "My Wishlist", icon: Heart },
    { id: "addresses", label: "My Addresses", icon: MapPin },
    { id: "customise", label: "Customise a Piece", icon: Gem },
  ];

  // Mock data for test user
  const mockProfile = {
    name: "Sadiya Siddiqui",
    email: "sadiya.siddiqui@evoljewels.com",
    phone: "+91 9963661025",
    joinDate: "June 01, 2026",
  };

  const mockOrders = [
    {
      id: "ORD-001",
      date: "2026-06-05",
      total: "Rs. 2,450",
      status: "Delivered",
    },
    {
      id: "ORD-002",
      date: "2026-06-05",
      total: "Rs. 1,850",
      status: "Delivered",
    },
  ];

  const mockWishlist = [
    { id: "W-001", name: "Emerald Cut Diamond Ring", price: "Rs. 25,000" },
    {
      id: "W-002",
      name: "Round Brilliant Engagement Ring",
      price: "Rs. 20,000",
    },
  ];

  const mockAddresses = [
    {
      id: "A-001",
      type: "Home",
      address: "123 Main Street, Hyderabad, Telangana 500001",
      isDefault: true,
    },
    {
      id: "A-002",
      type: "Office",
      address: "456 Corporate Ave, Hyderabad, Telangana 500002",
      isDefault: false,
    },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600 mb-2">Full Name</p>
                <p className="font-sans text-lg text-evol-dark-grey">
                  {mockProfile.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Email</p>
                <p className="font-sans text-lg text-evol-dark-grey">
                  {mockProfile.email}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Phone</p>
                <p className="font-sans text-lg text-evol-dark-grey">
                  {mockProfile.phone}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-2">Member Since</p>
                <p className="font-sans text-lg text-evol-dark-grey">
                  {mockProfile.joinDate}
                </p>
              </div>
            </div>
          </div>
        );

      case "orders":
        return (
          <div className="space-y-4">
            {mockOrders.length > 0 ? (
              mockOrders.map((order) => (
                <div
                  key={order.id}
                  className="border border-evol-grey rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-sans font-medium text-evol-dark-grey">
                      {order.id}
                    </p>
                    <p className="font-sans text-sm text-gray-600">
                      {order.date}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-medium text-evol-dark-grey">
                      {order.total}
                    </p>
                    <p className="font-sans text-sm text-evol-red">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">No orders yet</p>
            )}
          </div>
        );

      case "wishlist":
        return (
          <div className="space-y-4">
            {mockWishlist.length > 0 ? (
              mockWishlist.map((item) => (
                <div
                  key={item.id}
                  className="border border-evol-grey rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <p className="font-sans font-medium text-evol-dark-grey">
                      {item.name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-sans font-medium text-evol-dark-grey">
                      {item.price}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                No items in wishlist
              </p>
            )}
          </div>
        );

      case "addresses":
        return (
          <div className="space-y-4">
            {mockAddresses.length > 0 ? (
              mockAddresses.map((addr) => (
                <div
                  key={addr.id}
                  className="border border-evol-grey rounded-lg p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <p className="font-sans font-medium text-evol-dark-grey">
                      {addr.type}
                    </p>
                    {addr.isDefault && (
                      <span className="text-sm font-sans bg-evol-light-grey text-evol-red px-2 py-1 rounded">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="font-sans text-sm text-gray-600">
                    {addr.address}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600 text-center py-8">
                No addresses saved
              </p>
            )}
          </div>
        );

      case "customise":
        return (
          <div className="space-y-6">
            <div className="bg-evol-light-grey rounded-lg p-6 border border-evol-grey">
              <h3 className="font-sans font-medium text-evol-dark-grey mb-4">
                Design Your Custom Piece
              </h3>
              <p className="font-sans text-sm text-gray-600 mb-6">
                Create a Unique Lab-Grown Diamond Piece Tailored to Your Style.
                Work with our Design Team to Bring Your Vision to Life.
              </p>
              <button className="px-6 py-3 bg-evol-red text-white font-sans text-sm rounded hover:opacity-90 transition-opacity">
                Start Customization
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8">
        {/* Desktop Layout */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-8">
          {/* Sidebar */}
          <motion.div
            className="col-span-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white border border-evol-grey rounded-lg p-6 sticky top-20">
              {/* User Avatar */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 bg-evol-off-white rounded-full flex items-center justify-center mb-4">
                  <span className="font-sans text-lg font-medium text-evol-red">
                    {userInitials}
                  </span>
                </div>
                <h3 className="font-sans text-lg text-evol-dark-grey">
                  {displayUser?.name}
                </h3>
                <p className="font-sans text-sm text-gray-600 text-center mt-1">
                  {displayUser?.email}
                </p>
              </div>

              <div className="border-b border-evol-grey mb-6" />

              {/* Navigation */}
              <nav className="space-y-1 mb-6">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded text-sm font-sans transition-colors ${
                        activeTab === item.id
                          ? "bg-evol-light-grey text-evol-red"
                          : "text-evol-dark-grey hover:bg-evol-light-grey"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              <div className="border-b border-evol-grey mb-6" />

              {/* Sign Out */}
              <motion.button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-sans text-evol-red hover:bg-red-50 rounded transition-colors disabled:opacity-75"
                whileHover={!isSigningOut ? { scale: 1.02 } : {}}
              >
                {isSigningOut ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing Out...
                  </>
                ) : (
                  <>
                    <LogOut size={18} />
                    Sign Out
                  </>
                )}
              </motion.button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            className="col-span-3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <div className="bg-white border border-evol-grey rounded-lg p-8">
              {activeTab === "profile" ? (
                <>
                  <h2 className="font-sans text-2xl text-evol-dark-grey mb-4">
                    Welcome Back, {displayUser?.name}.
                  </h2>
                  <p className="font-sans text-gray-600 mb-8">
                    Your Account is All Set. Start Exploring.
                  </p>
                  <div className="mb-8">{renderTabContent()}</div>
                  <Link
                    href="/collections"
                    className="inline-block px-8 py-3 bg-evol-red text-white font-sans text-sm rounded hover:opacity-90 transition-opacity"
                  >
                    Shop Now
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="font-sans text-2xl text-evol-dark-grey mb-6 capitalize">
                    {navItems.find((item) => item.id === activeTab)?.label}
                  </h2>
                  {renderTabContent()}
                </>
              )}
            </div>
          </motion.div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {/* User Info */}
          <motion.div
            className="mb-8 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 bg-evol-off-white rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="font-sans text-2xl font-medium text-evol-red">
                {userInitials}
              </span>
            </div>
            <h3 className="font-sans text-2xl text-evol-dark-grey">
              {displayUser?.name}
            </h3>
            <p className="font-sans text-sm text-gray-600 mt-1">
              {displayUser?.email}
            </p>
          </motion.div>

          {/* Tabs */}
          <motion.div
            className="flex overflow-x-auto gap-4 mb-8 pb-4 border-b border-evol-grey"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 whitespace-nowrap text-sm font-sans transition-colors ${
                    activeTab === item.id
                      ? "text-evol-red border-b-2 border-evol-red"
                      : "text-gray-600 hover:text-evol-dark-grey"
                  }`}
                >
                  <Icon size={16} />
                  {item.label}
                </button>
              );
            })}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <div className="bg-white rounded-lg p-6 mb-8 border border-evol-grey">
              {activeTab === "profile" ? (
                <>
                  <h2 className="font-sans text-xl text-evol-dark-grey mb-3">
                    Welcome Back.
                  </h2>
                  <p className="font-sans text-sm text-gray-600 mb-6">
                    Your Account is All Set. Start Exploring.
                  </p>

                  <Link
                    href="/collections"
                    className="block text-center px-6 py-3 bg-evol-red text-white font-sans text-sm rounded mb-6 hover:opacity-90 transition-opacity"
                  >
                    Shop Now
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="font-sans text-xl text-evol-dark-grey mb-6 capitalize">
                    {navItems.find((item) => item.id === activeTab)?.label}
                  </h2>
                  {renderTabContent()}
                </>
              )}
            </div>

            {/* Sign Out Mobile */}
            <motion.button
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-sans text-evol-red border border-evol-red rounded hover:bg-red-50 transition-colors disabled:opacity-75"
              whileHover={!isSigningOut ? { scale: 1.02 } : {}}
            >
              {isSigningOut ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Signing out...
                </>
              ) : (
                <>
                  <LogOut size={16} />
                  Sign out
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
