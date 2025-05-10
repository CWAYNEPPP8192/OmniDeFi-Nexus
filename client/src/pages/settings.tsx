import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sliders, User, Bell, Shield, Wallet, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  const saveSettings = () => {
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully.",
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Tabs 
        defaultValue="general" 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="space-y-4"
      >
        <TabsList className="grid grid-cols-6 gap-4 bg-transparent p-0">
          <TabsTrigger 
            value="general"
            className={`flex flex-col items-center gap-1 rounded-lg border ${activeTab === "general" ? "border-primary bg-primary/5" : "border-border"} p-3`}
          >
            <Sliders className="h-5 w-5" />
            <span className="text-xs">General</span>
          </TabsTrigger>
          <TabsTrigger 
            value="profile"
            className={`flex flex-col items-center gap-1 rounded-lg border ${activeTab === "profile" ? "border-primary bg-primary/5" : "border-border"} p-3`}
          >
            <User className="h-5 w-5" />
            <span className="text-xs">Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications"
            className={`flex flex-col items-center gap-1 rounded-lg border ${activeTab === "notifications" ? "border-primary bg-primary/5" : "border-border"} p-3`}
          >
            <Bell className="h-5 w-5" />
            <span className="text-xs">Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security"
            className={`flex flex-col items-center gap-1 rounded-lg border ${activeTab === "security" ? "border-primary bg-primary/5" : "border-border"} p-3`}
          >
            <Shield className="h-5 w-5" />
            <span className="text-xs">Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="wallets"
            className={`flex flex-col items-center gap-1 rounded-lg border ${activeTab === "wallets" ? "border-primary bg-primary/5" : "border-border"} p-3`}
          >
            <Wallet className="h-5 w-5" />
            <span className="text-xs">Wallets</span>
          </TabsTrigger>
          <TabsTrigger 
            value="api"
            className={`flex flex-col items-center gap-1 rounded-lg border ${activeTab === "api" ? "border-primary bg-primary/5" : "border-border"} p-3`}
          >
            <Zap className="h-5 w-5" />
            <span className="text-xs">API</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Manage your application preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="theme">Theme</Label>
                  <Select defaultValue="system">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="language">Language</Label>
                  <Select defaultValue="english">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="english">English</SelectItem>
                      <SelectItem value="spanish">Spanish</SelectItem>
                      <SelectItem value="french">French</SelectItem>
                      <SelectItem value="german">German</SelectItem>
                      <SelectItem value="japanese">Japanese</SelectItem>
                      <SelectItem value="chinese">Chinese</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="currency">Currency</Label>
                  <Select defaultValue="usd">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="usd">USD ($)</SelectItem>
                      <SelectItem value="eur">EUR (€)</SelectItem>
                      <SelectItem value="gbp">GBP (£)</SelectItem>
                      <SelectItem value="jpy">JPY (¥)</SelectItem>
                      <SelectItem value="cny">CNY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-update">Automatic Updates</Label>
                  <div className="text-sm text-muted-foreground">
                    Receive the latest price and market updates
                  </div>
                </div>
                <Switch defaultChecked id="auto-update" />
              </div>
              
              <div className="flex items-center justify-between pt-3">
                <div className="space-y-0.5">
                  <Label htmlFor="analytics">Analytics</Label>
                  <div className="text-sm text-muted-foreground">
                    Help improve the platform by sharing anonymous usage data
                  </div>
                </div>
                <Switch defaultChecked id="analytics" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset to Defaults</Button>
            <Button onClick={saveSettings}>Save Changes</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Settings</CardTitle>
              <CardDescription>Manage your profile information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-6 pb-2">
                <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">
                  JD
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">Profile Photo</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    This will be displayed on your profile
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Upload</Button>
                    <Button variant="outline" size="sm">Remove</Button>
                  </div>
                </div>
              </div>
              
              <div className="grid gap-4 py-1">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" placeholder="John" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" placeholder="Doe" defaultValue="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john.doe@example.com" 
                    defaultValue="john.doe@example.com" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Input id="bio" placeholder="Tell us about yourself" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">Cancel</Button>
            <Button onClick={saveSettings}>Save Changes</Button>
          </div>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Choose what you want to be notified about.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive email notifications for important updates
                  </p>
                </div>
                <Switch defaultChecked id="email-notifications" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Price Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified when assets reach your price targets
                  </p>
                </div>
                <Switch defaultChecked id="price-alerts" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Get notified about important security events
                  </p>
                </div>
                <Switch defaultChecked id="security-alerts" />
              </div>
              
              <div className="flex items-center justify-between py-2">
                <div className="space-y-0.5">
                  <Label className="text-base">Marketing</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive news, updates, and offers from us
                  </p>
                </div>
                <Switch id="marketing" />
              </div>
            </CardContent>
          </Card>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button onClick={saveSettings}>Save Preferences</Button>
          </div>
        </TabsContent>
        
        {/* Other tab contents would go here */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage your account security preferences.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-medium">Change Password</h3>
                  <p className="text-sm text-muted-foreground">Update your password regularly for better security</p>
                </div>
                <Button variant="outline">Change</Button>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-medium">Two-Factor Authentication</h3>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                </div>
                <Button>Enable</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="wallets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Connected Wallets</CardTitle>
              <CardDescription>Manage your connected Web3 wallets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20.5 15V9C20.5 7.89543 19.6046 7 18.5 7H5.5C4.39543 7 3.5 7.89543 3.5 9V15C3.5 16.1046 4.39543 17 5.5 17H18.5C19.6046 17 20.5 16.1046 20.5 15Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16.5 12C16.5 10.8954 15.6046 10 14.5 10C13.3954 10 12.5 10.8954 12.5 12C12.5 13.1046 13.3954 14 14.5 14C15.6046 14 16.5 13.1046 16.5 12Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">MetaMask</h3>
                    <p className="text-sm text-muted-foreground">0x71C...7E9Fa</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Disconnect</Button>
              </div>
              <div className="flex justify-between items-center py-2">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19.5 4.5H4.5C3.39543 4.5 2.5 5.39543 2.5 6.5V17.5C2.5 18.6046 3.39543 19.5 4.5 19.5H19.5C20.6046 19.5 21.5 18.6046 21.5 17.5V6.5C21.5 5.39543 20.6046 4.5 19.5 4.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8.5 16.5C9.60457 16.5 10.5 15.6046 10.5 14.5C10.5 13.3954 9.60457 12.5 8.5 12.5C7.39543 12.5 6.5 13.3954 6.5 14.5C6.5 15.6046 7.39543 16.5 8.5 16.5Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-medium">WalletConnect</h3>
                    <p className="text-sm text-muted-foreground">Connect another wallet</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Connect</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Manage your API keys and connections.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-medium">OKX Gasless API</h3>
                  <p className="text-sm text-muted-foreground">Connected and active</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Manage</Button>
                  <Button size="sm" variant="default">Test Connection</Button>
                </div>
              </div>
              <div className="flex justify-between items-center py-2">
                <div>
                  <h3 className="font-medium">OpenAI API</h3>
                  <p className="text-sm text-muted-foreground">AI trading assistant integration</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Manage</Button>
                  <Button size="sm" variant="default">Test Connection</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;