
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  linkTo: string;
  bgColor?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, 
  description, 
  icon, 
  linkTo,
  bgColor = "bg-gradient-to-br from-blue-50 to-indigo-50" 
}) => {
  return (
    <Card className={`overflow-hidden transition-all hover:shadow-lg ${bgColor} border-none`}>
      <CardHeader className="pb-3">
        <div className="mb-2 w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
          {icon}
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm text-gray-600 min-h-[80px]">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="group border-indigo-300 hover:bg-indigo-50 w-full justify-between">
          <Link to={linkTo}>
            Explore Feature
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
