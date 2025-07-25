
export default function PrivacyPolicyPage() {
  return (
    <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-lg shadow-lg">
                <h1 className="font-headline text-4xl font-bold text-primary">Privacy Policy</h1>
                <p className="mt-4 text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <div className="prose prose-lg mt-8 max-w-none text-foreground/80">
                    <p>
                    Lankford Capital ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">Information We Collect</h2>
                    <p>
                    We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    
                    <h3 className="font-headline text-xl font-semibold mt-4">Personal Data</h3>
                    <p>
                    Personally identifiable information, such as your name, email address, and telephone number, and financial information, such as data related to your income, assets, and credit history, that you voluntarily give to us when you apply for a loan, fill out a form, or when you choose to participate in various activities related to the Site, such as our AI assistant and document upload features.
                    </p>

                     <h3 className="font-headline text-xl font-semibold mt-4">Derivative Data</h3>
                    <p>
                    Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">Use of Your Information</h2>
                    <p>
                    Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul>
                        <li>Administer your loan application and account.</li>
                        <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                        <li>Generate a personal profile about you to make future visits to the Site more personalized.</li>
                        <li>Increase the efficiency and operation of the Site.</li>
                    </ul>

                     <h2 className="font-headline text-2xl font-bold text-primary mt-8">Disclosure of Your Information</h2>
                    <p>
                    We may share information we have collected about you in certain situations. Your information may be disclosed as follows:
                    </p>
                     <h3 className="font-headline text-xl font-semibold mt-4">By Law or to Protect Rights</h3>
                    <p>
                    If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation.
                    </p>
                     <h3 className="font-headline text-xl font-semibold mt-4">Third-Party Service Providers</h3>
                    <p>
                    We may share your information with third parties that perform services for us or on our behalf, including data analysis, email delivery, hosting services, customer service, and marketing assistance.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">Security of Your Information</h2>
                    <p>
                    We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">Contact Us</h2>
                    <p>
                    If you have questions or comments about this Privacy Policy, please contact us at:
                    </p>
                    <p>
                    Lankford Capital <br/>
                    Underwriting@lankfordcapital.com <br/>
                    888-708-6146
                    </p>
                </div>
            </div>
        </div>
    </div>
  );
}
