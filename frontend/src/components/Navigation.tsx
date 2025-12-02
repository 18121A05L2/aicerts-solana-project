import "./navigation.css";

export function Navigation() {
  return (
    <div className="nav-wrapper">
      <ul className="nav-list">
        <li>
          <a className="nav-link" href="/createTemplate">
            Create Template
          </a>
        </li>
        <li>
          <a className="nav-link" href="/issueCredential">
            Issue Credential
          </a>
        </li>
        <li>
          <a className="nav-link" href="/verification">
            Verification
          </a>
        </li>
        <li>
          <a className="nav-link" href="/recipientView">
            Recipient View
          </a>
        </li>
      </ul>
    </div>
  );
}
