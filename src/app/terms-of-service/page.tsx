
export default function TermsOfServicePage() {
  return (
    <div className="bg-primary/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card p-8 md:p-12 rounded-lg shadow-lg">
                <h1 className="font-headline text-4xl font-bold text-primary">Terms of Service</h1>
                <p className="mt-4 text-muted-foreground">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

                <div className="prose prose-lg mt-8 max-w-none text-foreground/80">
                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">1. Agreement to Terms</h2>
                    <p>
                    By using our website and services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">2. Use of Our Services</h2>
                    <p>
                    You may use our services only for lawful purposes and in accordance with these Terms. You agree not to use the services:
                    </p>
                    <ul>
                        <li>In any way that violates any applicable federal, state, local, or international law or regulation.</li>
                        <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Site, or which, as determined by us, may harm Lankford Capital or users of the Site.</li>
                    </ul>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">3. Intellectual Property Rights</h2>
                    <p>
                    The Site and its entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof) are owned by Lankford Capital, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
                    </p>

                     <h2 className="font-headline text-2xl font-bold text-primary mt-8">4. Disclaimer of Warranties</h2>
                    <p>
                    Your use of the website is at your own risk. The service is provided on an "AS IS" and "AS AVAILABLE" basis. We disclaim all warranties of any kind, whether express or implied, including, but not limited to, the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">5. Limitation of Liability</h2>
                    <p>
                    In no event shall Lankford Capital, its affiliates, or their licensors, service providers, employees, agents, officers, or directors be liable for damages of any kind, under any legal theory, arising out of or in connection with your use, or inability to use, the website, any websites linked to it, any content on the website, or such other websites.
                    </p>

                     <h2 className="font-headline text-2xl font-bold text-primary mt-8">6. Changes to Terms of Service</h2>
                    <p>
                    We may revise and update these Terms of Service from time to time in our sole discretion. All changes are effective immediately when we post them. Your continued use of the Website following the posting of revised Terms of Service means that you accept and agree to the changes.
                    </p>

                    <h2 className="font-headline text-2xl font-bold text-primary mt-8">7. Contact Us</h2>
                    <p>
                    If you have any questions about these Terms of Service, please contact us at:
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
