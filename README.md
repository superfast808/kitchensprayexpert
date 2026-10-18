# Kitchen Spraying Expert

Fresh, mobile-first, SEO-oriented replacement for kitchensprayexpert.co.uk, designed for Plesk + Docker on port **8105**. Existing live site remains untouched until cutover.

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
    curl -I http://127.0.0.1:8105

6. Configure a dedicated Plesk test host, for example **kitchenspray.toastercabs.co.uk**, with HTTPS and reverse proxy pointing to http://127.0.0.1:8105. The service binds to the host loopback, so it is not accessible through port 8105 directly. Do not replace another toastercabs service.

7. Sign in at https://kitchenspray.toastercabs.co.uk/admin/login/, choose **Import old website images** and refresh the dashboard to view status. The importer is designed to work before the old site is switched off. Re-run if required; pictures are stored in /opt/kitchensprayexpert/data/uploads. Choose an imported picture as the home hero, and edit its alt description.

## Pull / rebuild commands

    cd /opt/kitchensprayexpert
    git pull --ff-only
    docker compose up -d --build
    docker compose logs --tail=60

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
