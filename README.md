# Kitchen Spraying Expert

Fresh, mobile-first, SEO-oriented replacement for kitchensprayexpert.co.uk, designed for Plesk + Docker on port **8106**. Existing live site remains untouched until cutover.

## Included

- Premium homepage, service pages, local landing pages, pricing, gallery, process, about, contact, privacy.
- Server-rendered HTML, canonical links, distinct metadata, relevant Schema.org structured data, image descriptions, Open Graph tags and breadcrumbs.
- XML sitemap and robots.txt; fully NOINDEX in PREVIEW_MODE.
- Persisted contact enquiries, SMTP delivery when configured, optional Cloudflare Turnstile.
- Password-protected admin at /admin/login/ to view/delete enquiries, edit homepage copy, upload pictures, set hero picture, and import images from the old site.
- Importer crawls old pages, image tags, responsive sources and CSS background images, including the old site's custom /images/ directory. Converts images to local WebP and skips previously imported sources.
- Known legacy cost-article redirect and properly canonicalised paths.

**Please confirm** address, phone, guarantee and the advertised starting prices before production launch. Those details were taken from the old public site. Imported photography should be treated as inspiration until confirmed as authentic completed customer projects. The privacy notice requires the site's data controller and retention details to be reviewed.

## First deployment on Plesk

Clone destination: /opt/kitchensprayexpert

1. Create the GitHub deploy key on your Plesk server:

    mkdir -p ~/.ssh
    ssh-keygen -t ed25519 -C "kitchensprayexpert-plesk" -f ~/.ssh/kitchensprayexpert_deploy -N ""
    cat ~/.ssh/kitchensprayexpert_deploy.pub

2. Add the printed PUBLIC key to repository Settings → Deploy keys → Add deploy key. Leave write access OFF. The repository is superfast808/kitchensprayexpert.

3. Set up the SSH alias and clone:

    cat >> ~/.ssh/config <<'EOF'
    Host github-kitchenspray
      HostName github.com
      User git
      IdentityFile ~/.ssh/kitchensprayexpert_deploy
      IdentitiesOnly yes
    EOF
    chmod 600 ~/.ssh/config ~/.ssh/kitchensprayexpert_deploy
    ssh -T git@github-kitchenspray
    sudo mkdir -p /opt/kitchensprayexpert
    sudo chown "$(id -u):$(id -g)" /opt/kitchensprayexpert
    git clone git@github-kitchenspray:superfast808/kitchensprayexpert.git /opt/kitchensprayexpert
    cd /opt/kitchensprayexpert
    cp .env.example .env
    mkdir -p data/uploads
    sudo chown -R 1000:1000 data

4. Generate a secret, then set up the environment:

    openssl rand -hex 48
    nano /opt/kitchensprayexpert/.env

Required admin values: ADMIN_PASSWORD (strong, unique); SESSION_SECRET (paste the output of openssl above). **Leave PREVIEW_MODE=true for the toastercabs test.** Set CONTACT_TO and all SMTP_* fields to activate email delivery; enquiries are still stored in the admin if SMTP is not yet configured.

5. Start the service:

    cd /opt/kitchensprayexpert
    docker compose up -d --build
    docker compose ps
    docker compose logs --tail=60
    curl -I http://127.0.0.1:8106

6. Configure a dedicated Plesk test host, for example **kitchenspray.toastercabs.co.uk**, with HTTPS and reverse proxy pointing to http://127.0.0.1:8106. The service binds to the host loopback, so it is not accessible through port 8106 directly. Do not replace another toastercabs service.

7. Sign in at https://kitchenspray.toastercabs.co.uk/admin/login/, choose **Import old website images** and refresh the dashboard to view status. The importer is designed to work before the old site is switched off. Re-run if required; pictures are stored in /opt/kitchensprayexpert/data/uploads. Choose an imported picture as the home hero, and edit its alt description.

## Pull / rebuild commands

    cd /opt/kitchensprayexpert
    git pull --ff-only
    docker compose up -d --build
    docker compose logs --tail=60

## SEO heading and indexing checks

The homepage has one fixed, keyword-focused H1: **Professional Kitchen Spraying in Glasgow & Across Scotland**. The original marketing line remains editable in admin as the supporting tagline, so changing it will not accidentally replace the SEO heading. Core service and geographic landing pages have individual content and descriptions.

GitHub Actions runs `npm run check` and `npm test` on new commits, including H1 and location-page regression tests.

After deploying to the **live domain**, verify the response headers, meta robots, H1 tags, canonicals, robots.txt and sitemap.xml from within the running container:

    cd /opt/kitchensprayexpert
    docker compose exec web npm run check:live-seo

A failure reporting `noindex` or blocked crawling indicates that the live instance may still have `PREVIEW_MODE=true` in the **server's private .env**. Change it to `false` only on the production installation, then recreate the container using `docker compose up -d --build`. Keep it `true` on staging/test environments.

## Live switch

- Confirm contact details, pricing, guarantees and genuine project imagery.
- Test enquiry submission, SMTP delivery, admin login, gallery and mobile navigation.
- Ensure correct HTTPS certificates and domain routing for kitchensprayexpert.co.uk and www.
- Only when live, set PREVIEW_MODE=false, rebuild, and verify /robots.txt and /sitemap.xml.
- Check canonical URLs and redirection of old important pages, then submit the sitemap to Google Search Console.
- Monitor indexing and 404 URLs in Search Console and add 301 redirects as needed.
- Back up /opt/kitchensprayexpert/data and .env, as both are excluded from Git.
- Consider locking down /admin/ in Plesk or Cloudflare Access and enabling Turnstile for enquiries.

The media importer uses the OLD SITE as its source. Complete media migration **before** changing the public DNS or Plesk site mapping. The temporary test site is noindex by default.

### Search Console verification

In admin → Website content, enter your Google HTML verification filename (for example google123abc.html), save, then Google can fetch the expected verification content at the corresponding URL. This does not replace DNS verification, which may be preferable for the entire domain.


## Navigation, logo management and admin password reset

Navigation includes descriptive Services and Areas dropdowns with aligned chevrons, keyboard/click controls, and mobile accordions. Interior landing pages use photographic, split-layout heroes. When media is imported and verified, those pages favour local WebP imagery.

In /admin/, open Company logo to upload a transparent PNG/JPEG/WebP header logo and (optionally) a separate light-coloured footer logo. Logos persist in the Docker data volume. The plain company wordmark is used until your logo is uploaded; the previous fake initial icon is gone.

If the admin password from .env is rejected, Docker Compose may have interpolated a $ character or the running container may have retained an older environment value. A secure interactive reset is now available and stores a salted scrypt hash in the persistent volume. The new hash supersedes the legacy ADMIN_PASSWORD environment value.

    cd /opt/kitchensprayexpert
    git pull --ff-only
    docker compose up -d --build
    docker compose exec web node scripts/admin-status.js
    docker compose exec -it web node scripts/reset-admin-password.js

Enter and confirm a new password at the masked prompts. The new password takes effect immediately and existing sessions are invalidated. Do not copy passwords into terminal command-line arguments or logs. SESSION_SECRET must still be populated in .env. You do not need to change ADMIN_PASSWORD in .env after using this tool; the stored hash takes precedence.

## Optional finishing touches and add-ons

The homepage, kitchen spraying services and price pages now feature a 'Complete the look' section. The Services navigation links to the dedicated SEO page `/kitchen-upgrades/`. It discusses optional handles and hardware, worktops, and sinks/taps only in connection with kitchen spraying. Extras are **not included in published spraying guide prices** and require confirmation of suitability, availability, separate quotation and fitting arrangements.

The enquiry form accepts any combination of these optional extras. Selection is persisted with the enquiry, displayed in admin and sent in the configured SMTP notification. The link from each add-on card preselects the corresponding checkbox on the quotation form.


## Colour explorer and sharper heroes

- The home page and kitchen spraying service pages now include a RAL Classic inspiration chart.
- A full RAL chart is available at /ral-colours/, with 18 named illustrative swatches and selectable colour families. It is included in the sitemap and navigation.
- Each selected shade updates a cabinet preview and links to the contact page with that RAL code prefilled. The code is stored with the enquiry, included in admin and SMTP notifications.
- Swatches are illustrative screen colours rather than official RAL matches. Confirm physical samples, intended finish and actual availability before making claims.
- The extras checkboxes are now large selectable tiles with native accessible controls and clear selected states.
- Home and interior heroes use discrete solid-colour copy panels and unobscured photographs instead of image gradients.
- Individual arrows are removed from descriptive dropdown links; the top-level menu chevrons remain.

## Google Business Profile structured data

The site includes an exact `sameAs` and `hasMap` link for Kitchen Spraying Expert's Google Business Profile at **14 North Avenue, Clydebank G81 2QP**, using Google Place ID `ChIJR2WVf9NPiEgRr7OCATM9DlI`. This is the kitchen-spraying business listing (not the separate King Specialist Coatings listing). The schema address includes Unit 6, Dunrobin Court, 14 North Avenue, Clydebank, G81 2QP. Verify business details against the managed profile whenever they change. The quote form's RAL field now shows an illustrative matching colour swatch, and the optional-extras subtitle is constrained to the form width.
