"use client";

import { Icon } from "@iconify/react";
import { CompanyProfile } from "../data/mockCompanyData";

interface CompanyContactProps {
  contact: CompanyProfile["contact"];
  socialMedia?: CompanyProfile["socialMedia"];
}

export function CompanyContact({
  contact,
  socialMedia,
}: CompanyContactProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Contact Information */}
      <div className="rounded-lg bg-surface border border-subtle p-6">
        <div className="flex items-center gap-2 mb-4">
          <Icon icon="lucide:mail" className="w-5 h-5 text-main-accent" />
          <h2 className="text-xl font-semibold font-title text-main-text">
            Contact Information
          </h2>
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Icon
              icon="lucide:mail"
              className="w-5 h-5 text-main-light-text mt-0.5"
            />
            <div>
              <p className="text-xs text-main-light-text mb-1">Email</p>
              <a
                href={`mailto:${contact.email}`}
                className="text-sm font-medium text-main-accent hover:underline"
              >
                {contact.email}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon
              icon="lucide:phone"
              className="w-5 h-5 text-main-light-text mt-0.5"
            />
            <div>
              <p className="text-xs text-main-light-text mb-1">Phone</p>
              <a
                href={`tel:${contact.phone}`}
                className="text-sm font-medium text-main-text hover:text-main-accent"
              >
                {contact.phone}
              </a>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Icon
              icon="lucide:map-pin"
              className="w-5 h-5 text-main-light-text mt-0.5"
            />
            <div>
              <p className="text-xs text-main-light-text mb-1">Address</p>
              <p className="text-sm font-medium text-main-text">
                {contact.address}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media */}
      {socialMedia && (
        <div className="rounded-lg bg-surface border border-subtle p-6">
          <div className="flex items-center gap-2 mb-4">
            <Icon icon="lucide:share-2" className="w-5 h-5 text-main-accent" />
            <h2 className="text-xl font-semibold font-title text-main-text">
              Social Media
            </h2>
          </div>
          <div className="space-y-3">
            {socialMedia.linkedin && (
              <a
                href={`https://${socialMedia.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-light-bg border border-subtle hover:border-main-accent/50 transition-colors group"
              >
                <Icon
                  icon="lucide:linkedin"
                  className="w-5 h-5 text-main-accent"
                />
                <span className="text-sm font-medium text-main-text group-hover:text-main-accent">
                  LinkedIn
                </span>
              </a>
            )}
            {socialMedia.twitter && (
              <a
                href={`https://twitter.com/${socialMedia.twitter.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-light-bg border border-subtle hover:border-main-accent/50 transition-colors group"
              >
                <Icon
                  icon="lucide:twitter"
                  className="w-5 h-5 text-main-accent"
                />
                <span className="text-sm font-medium text-main-text group-hover:text-main-accent">
                  Twitter
                </span>
              </a>
            )}
            {socialMedia.facebook && (
              <a
                href={`https://${socialMedia.facebook}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg bg-light-bg border border-subtle hover:border-main-accent/50 transition-colors group"
              >
                <Icon
                  icon="lucide:facebook"
                  className="w-5 h-5 text-main-accent"
                />
                <span className="text-sm font-medium text-main-text group-hover:text-main-accent">
                  Facebook
                </span>
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

