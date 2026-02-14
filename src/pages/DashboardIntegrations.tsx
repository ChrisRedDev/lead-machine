import { useState } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
    Plug,
    Check,
    ExternalLink,
    Zap,
    RefreshCw,
    Settings,
    Trash2,
    Copy
} from "lucide-react";
import { toast } from "sonner";

const DashboardIntegrations = () => {
    const [apiKey] = useState("lm_sk_1234567890abcdef");
    const [webhookUrl, setWebhookUrl] = useState("");

    const integrations = [
        {
            name: "Salesforce",
            description: "Sync leads directly to Salesforce CRM",
            icon: "🔷",
            connected: true,
            category: "CRM"
        },
        {
            name: "HubSpot",
            description: "Push leads to HubSpot contacts",
            icon: "🟠",
            connected: false,
            category: "CRM"
        },
        {
            name: "Pipedrive",
            description: "Export deals to Pipedrive",
            icon: "🟢",
            connected: false,
            category: "CRM"
        },
        {
            name: "Zapier",
            description: "Connect to 1000+ apps via Zapier",
            icon: "⚡",
            connected: true,
            category: "Automation"
        },
        {
            name: "Slack",
            description: "Get notifications in Slack",
            icon: "💬",
            connected: false,
            category: "Communication"
        },
        {
            name: "Google Sheets",
            description: "Auto-export to Google Sheets",
            icon: "📊",
            connected: false,
            category: "Productivity"
        },
        {
            name: "Mailchimp",
            description: "Add leads to Mailchimp lists",
            icon: "📧",
            connected: false,
            category: "Email Marketing"
        },
        {
            name: "Make (Integromat)",
            description: "Build custom workflows with Make",
            icon: "🔧",
            connected: false,
            category: "Automation"
        }
    ];

    const handleConnect = (name: string) => {
        toast.success(`${name} connection initiated!`);
    };

    const handleDisconnect = (name: string) => {
        toast.success(`${name} disconnected`);
    };

    const handleCopyApiKey = () => {
        navigator.clipboard.writeText(apiKey);
        toast.success("API key copied to clipboard!");
    };

    const handleSaveWebhook = () => {
        if (!webhookUrl) {
            toast.error("Please enter a webhook URL");
            return;
        }
        toast.success("Webhook saved successfully!");
    };

    return (
        <>
            <DashboardHeader title="Integrations" />
            <main className="p-4 lg:p-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h2 className="text-xl font-display font-bold tracking-tight mb-1">Integrations & API</h2>
                    <p className="text-sm text-muted-foreground">Connect Lead Machine with your favorite tools</p>
                </div>

                {/* API Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <Card className="p-6 border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">API Access</h3>
                                <p className="text-xs text-muted-foreground">Use our REST API for custom integrations</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Your API Key</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={apiKey}
                                        readOnly
                                        className="h-9 rounded-xl bg-secondary border-border font-mono text-sm flex-1"
                                    />
                                    <Button size="sm" variant="outline" onClick={handleCopyApiKey} className="h-9 rounded-xl">
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-9 rounded-xl flex-1">
                                    <RefreshCw className="w-4 h-4 mr-2" />
                                    Regenerate
                                </Button>
                                <Button size="sm" variant="outline" className="h-9 rounded-xl flex-1">
                                    <ExternalLink className="w-4 h-4 mr-2" />
                                    Docs
                                </Button>
                            </div>

                            <div className="pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    API Endpoint: <code className="px-1.5 py-0.5 rounded bg-muted text-foreground">https://api.leadmachine.ai/v1</code>
                                </p>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-border">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
                                <Plug className="w-5 h-5 text-success" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Custom Webhooks</h3>
                                <p className="text-xs text-muted-foreground">Send lead data to your own endpoints</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Webhook URL</label>
                                <Input
                                    placeholder="https://your-app.com/webhook"
                                    value={webhookUrl}
                                    onChange={(e) => setWebhookUrl(e.target.value)}
                                    className="h-9 rounded-xl bg-secondary border-border"
                                />
                            </div>

                            <Button onClick={handleSaveWebhook} className="h-9 rounded-xl bg-gradient-primary w-full">
                                <Check className="w-4 h-4 mr-2" />
                                Save Webhook
                            </Button>

                            <div className="pt-2 border-t border-border">
                                <p className="text-xs text-muted-foreground">
                                    Webhook triggers on: New leads generated, Export created
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Integrations Grid */}
                <div>
                    <h3 className="text-sm font-semibold mb-4">Available Integrations</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {integrations.map((integration, i) => (
                            <motion.div
                                key={integration.name}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <Card className={`p-5 border-border hover-lift ${integration.connected ? 'ring-2 ring-success/20' : ''}`}>
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="text-3xl">{integration.icon}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="text-sm font-semibold">{integration.name}</h4>
                                                {integration.connected && (
                                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse-soft" />
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">{integration.description}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between pt-3 border-t border-border">
                                        <span className="text-xs text-muted-foreground">{integration.category}</span>
                                        {integration.connected ? (
                                            <div className="flex gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2"
                                                    onClick={() => handleDisconnect(integration.name)}
                                                >
                                                    <Settings className="w-3.5 h-3.5" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-7 px-2 text-destructive hover:text-destructive"
                                                    onClick={() => handleDisconnect(integration.name)}
                                                >
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                size="sm"
                                                className="h-7 px-3 text-xs rounded-lg"
                                                onClick={() => handleConnect(integration.name)}
                                            >
                                                Connect
                                            </Button>
                                        )}
                                    </div>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Help Section */}
                <Card className="p-5 border-border mt-6">
                    <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                            <ExternalLink className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold mb-1">Need Help?</h3>
                            <p className="text-xs text-muted-foreground mb-3">
                                Check out our integration guides and API documentation to get started quickly.
                            </p>
                            <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                                    View Documentation
                                </Button>
                                <Button size="sm" variant="outline" className="h-8 rounded-lg text-xs">
                                    Contact Support
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </main>
        </>
    );
};

export default DashboardIntegrations;
