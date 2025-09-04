import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DollarSign, Users, TrendingUp, Clock, CheckCircle, ExternalLink, Filter } from "lucide-react"

const featuredGrants = [
  {
    title: "Web3 Innovation Grant",
    organization: "Ethereum Foundation",
    amount: "$50,000",
    deadline: "15 days left",
    match: 95,
    requirements: ["Smart Contract Development", "Open Source", "Community Impact"],
    status: "recommended",
  },
  {
    title: "DeFi Research Grant",
    organization: "Compound Labs",
    amount: "$25,000",
    deadline: "8 days left",
    match: 88,
    requirements: ["DeFi Experience", "Research Background", "Technical Writing"],
    status: "eligible",
  },
  {
    title: "Developer Tooling Grant",
    organization: "Polygon Foundation",
    amount: "$15,000",
    deadline: "22 days left",
    match: 82,
    requirements: ["Developer Tools", "Open Source", "Documentation"],
    status: "eligible",
  },
]

const appliedGrants = [
  {
    title: "Privacy Tech Grant",
    organization: "Protocol Labs",
    amount: "$30,000",
    status: "under_review",
    appliedDate: "2 weeks ago",
    nextStep: "Technical interview scheduled",
  },
  {
    title: "Community Building Grant",
    organization: "Gitcoin",
    amount: "$10,000",
    status: "approved",
    appliedDate: "1 month ago",
    nextStep: "Funding disbursed",
  },
]

const grantStats = [
  { label: "Total Available", value: "$2.4M", icon: DollarSign, color: "teal" },
  { label: "Matching Grants", value: "12", icon: TrendingUp, color: "purple" },
  { label: "Applications", value: "3", icon: Users, color: "blue" },
  { label: "Success Rate", value: "67%", icon: CheckCircle, color: "green" },
]

export function GrantsView() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Grants & Opportunities</h1>
        <div className="flex gap-2">
          <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white">
            Browse All Grants
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {grantStats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card
              key={index}
              className={`bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50 hover:border-${stat.color}-500/30 transition-all duration-300`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">{stat.label}</p>
                    <p className="text-2xl font-bold text-white">{stat.value}</p>
                  </div>
                  <div
                    className={`w-12 h-12 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-lg flex items-center justify-center`}
                  >
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Featured Grants */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Recommended for You</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {featuredGrants.map((grant, index) => (
              <div
                key={index}
                className="p-6 rounded-lg bg-gray-800/30 border border-gray-700/30 hover:border-teal-500/30 transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1">{grant.title}</h3>
                    <p className="text-gray-400">{grant.organization}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-teal-400">{grant.amount}</p>
                    <p className="text-gray-400 text-sm flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {grant.deadline}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <Badge
                    className={`${grant.status === "recommended" ? "bg-teal-500/20 text-teal-400 border-teal-500/30" : "bg-purple-500/20 text-purple-400 border-purple-500/30"}`}
                  >
                    {grant.match}% Match
                  </Badge>
                  <Badge variant="outline" className="border-gray-600 text-gray-300">
                    {grant.status === "recommended" ? "Highly Recommended" : "Eligible"}
                  </Badge>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-2">Requirements:</p>
                  <div className="flex flex-wrap gap-2">
                    {grant.requirements.map((req, reqIndex) => (
                      <Badge key={reqIndex} variant="outline" className="border-gray-600 text-gray-300 text-xs">
                        {req}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white">
                    Apply Now
                  </Button>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Learn More
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applied Grants */}
      <Card className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-gray-700/50">
        <CardHeader>
          <CardTitle className="text-white">Your Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {appliedGrants.map((grant, index) => (
              <div key={index} className="p-4 rounded-lg bg-gray-800/30 border border-gray-700/30">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-medium">{grant.title}</h4>
                    <p className="text-gray-400 text-sm">
                      {grant.organization} • Applied {grant.appliedDate}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold">{grant.amount}</p>
                    <Badge
                      className={`${grant.status === "approved" ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"}`}
                    >
                      {grant.status === "approved" ? "Approved" : "Under Review"}
                    </Badge>
                  </div>
                </div>
                <p className="text-gray-300 text-sm mt-2">{grant.nextStep}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
